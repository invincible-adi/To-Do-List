//routes for user
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, changePassword, getProfile, updateProfile } = require('../controller/userController');
const { addList, getAllLists, getListById, searchLists, filterLists, updateList, deleteList, getListByUserId, getTodos } = require('../controller/listController');
const verifyToken = require('../middleware/verifytoken');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, req.user._id + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

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
router.get('/todos', verifyToken, getTodos);

router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, upload.single('profileImage'), updateProfile);

module.exports = router;