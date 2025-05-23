//make controller for user
const User = require('../model/userSchema');
const List = require('../model/listSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
// const resetPasstemp = require('../utils/Emailtemplate.jsx')

// user registration
const registerUser = async (req, res) => {
    const { name, email, password, age, dateOfBirth } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Auto-generate username from email
        const username = email.split('@')[0];
        // Password validation: minimum 8 characters
        if (!password || password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username,
            age,
            dateOfBirth
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
        console.log(error)
    }
};

// user login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h',
        });
        res.status(200).json({ token, user: { id: user._id, name: user.name } });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

//make controller for forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h',
        });
        // send email with token
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password reset',
            text: `Click the link to reset your password: ${process.env.FRONTEND_URL}reset-password/${token}`,
        };
        await transporter.sendMail(mailOptions);
        console.log(mailOptions)
        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    if (!password) {
        return res.status(400).json({ message: "New password is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, req.user._id + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// GET /profile
const getProfile = async (req, res) => {
    const user = req.user;
    res.json({
        user: {
            name: user.name,
            username: user.username,
            email: user.email,
            age: user.age,
            dateOfBirth: user.dateOfBirth,
            profileImageUrl: user.profileImageUrl || null
        }
    });
};

// PUT /profile
const updateProfile = async (req, res) => {
    try {
        const user = req.user;
        const { name, age, dateOfBirth } = req.body;
        if (name) user.name = name;
        if (age) user.age = age;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (req.file) {
            user.profileImageUrl = `/uploads/${req.file.filename}`;
        }
        // Defensive: Ensure username is never undefined or missing
        if (!user.username) {
            user.username = user.email.split('@')[0];
        }
        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    changePassword,
    getProfile,
    updateProfile
};