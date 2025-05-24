//make controller for list
const List = require('../model/listSchema');
const User = require('../model/userSchema');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { body, param, query, validationResult } = require('express-validator');

//add list
const addListValidation = [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('description').trim().notEmpty().withMessage('Task description is required'),
    body('status').isIn(['Pending', 'Completed']).withMessage('Invalid task status'),
];

const addList = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status } = req.body;
    const userId = req.user._id;
    try {
        const newList = new List({
            title,
            description,
            status,
            user: userId,
        });
        await newList.save();
        res.status(201).json({ message: 'List added successfully', list: newList });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

//get all lists
const getAllLists = async (req, res) => {
    const userId = req.user._id;
    try {
        const lists = await List.find({ user: userId });
        res.status(200).json({ lists });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
//get list by id
const getListById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;
    try {
        const list = await List.findOne({ _id: id, user: userId });
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }
        res.status(200).json({ list });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
//update list
const updateListValidation = [
    param('id').isMongoId().withMessage('Invalid task ID format'),
    body('title').optional().trim().notEmpty().withMessage('Task title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Task description cannot be empty'),
    body('status').optional().isIn(['Pending', 'Completed']).withMessage('Invalid task status'),
];

const updateList = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user._id;
    try {
        const updatedList = await List.findOneAndUpdate(
            { _id: id, user: userId },
            { title, description, status },
            { new: true }
        );
        if (!updatedList) {
            return res.status(404).json({ message: 'List not found' });
        }
        res.status(200).json({ message: 'List updated successfully', list: updatedList });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
//delete list
const deleteListValidation = [
    param('id').isMongoId().withMessage('Invalid task ID format'),
];

const deleteList = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const userId = req.user._id;
    try {
        const deletedList = await List.findOneAndDelete({ _id: id, user: userId });
        if (!deletedList) {
            return res.status(404).json({ message: 'List not found' });
        }
        res.status(200).json({ message: 'List deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

//get list by user id (aggregation)
const getListByUserId = async (req, res) => {
    const userId = req.params.userId;
    try {
        const lists = await List.aggregate([
            { $match: { user: mongoose.Types.ObjectId(userId) } }
        ]);
        if (!lists) {
            return res.status(404).json({ message: 'No lists found for this user' });
        }
        res.status(200).json({ lists });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

//search lists
const searchLists = async (req, res) => {
    const userId = req.user._id;

    try {
        const { searchTerm } = req.query;

        if (!searchTerm) {
            return res.status(400).json({ message: 'Search term is required' });
        }

        const lists = await List.find({
            user: userId,
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ]
        });

        res.status(200).json({
            lists,
            total: lists.length,
            searchTerm
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

//filter lists
const filterLists = async (req, res) => {
    const userId = req.user._id;

    try {
        const { status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        // Build the query object
        let query = { user: userId };

        // Add status filter if provided
        if (status) {
            query.status = status;
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const lists = await List.find(query).sort(sort);

        res.status(200).json({
            lists,
            total: lists.length,
            filters: {
                status: status || null,
                sortBy,
                sortOrder
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Unified search, filter, and pagination endpoint
const getTodos = async (req, res) => {
    const userId = req.user._id;
    try {
        const { searchTerm = '', status, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;
        const query = { user: userId };
        if (status && status !== 'All') query.status = status;
        if (searchTerm) {
            query.$or = [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ];
        }
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const [lists, total] = await Promise.all([
            List.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
            List.countDocuments(query)
        ]);
        res.status(200).json({
            lists,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            limit: parseInt(limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    addList,
    getAllLists,
    getListById,
    updateList,
    deleteList,
    getListByUserId,
    searchLists,
    filterLists,
    getTodos,
    addListValidation,
    updateListValidation,
    deleteListValidation
};
