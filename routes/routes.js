//routes for user
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, changePassword } = require('../controller/userController');
const { addList, getAllLists, getListById, searchLists, filterLists, updateList, deleteList, getListByUserId } = require('../controller/listController');
const verifyToken = require('../middleware/verifytoken');
// const {  } = require('../controller/listController');

// routes for user
router.post('/register', registerUser);
router.post('/login', loginUser);

//routes for forgot password & reset password 
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);
router.put('/changepassword', verifyToken, changePassword)

//routes for list
router.post('/addlist', verifyToken, addList);
// router.get('/getalllists', verifyToken, getAllLists);
// router.get('/getlist/:id', verifyToken, getListById);
router.put('/updatelist/:id', verifyToken, updateList);
router.delete('/deletelist/:id', verifyToken, deleteList);
router.get('/getlistbyuserid/:userId', verifyToken, getListByUserId);
router.get('/searchlists', verifyToken, searchLists);
router.get('/filterlists', verifyToken, filterLists);

module.exports = router;