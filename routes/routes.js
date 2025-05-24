//routes for user
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, changePassword, getProfile, updateProfile, registerUserValidation, loginUserValidation, forgotPasswordValidation, resetPasswordValidation, changePasswordValidation, updateProfileValidation } = require('../controller/userController');
const { addList, getAllLists, getListById, searchLists, filterLists, updateList, deleteList, getListByUserId, getTodos, addListValidation, updateListValidation, deleteListValidation } = require('../controller/listController');
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
router.post('/register', ...registerUserValidation, registerUser);
router.post('/login', ...loginUserValidation, loginUser);

//routes for forgot password & reset password 
router.post('/forgotpassword', ...forgotPasswordValidation, forgotPassword);
router.put('/resetpassword', ...resetPasswordValidation, resetPassword);
router.put('/changepassword', verifyToken, ...changePasswordValidation, changePassword)

//routes for list
router.post('/addlist', verifyToken, ...addListValidation, addList);
// router.get('/getalllists', verifyToken, getAllLists);
// router.get('/getlist/:id', verifyToken, getListById);
router.put('/updatelist/:id', verifyToken, ...updateListValidation, updateList);
router.delete('/deletelist/:id', verifyToken, ...deleteListValidation, deleteList);
router.get('/getlistbyuserid/:userId', verifyToken, getListByUserId);
router.get('/searchlists', verifyToken, searchLists);
router.get('/filterlists', verifyToken, filterLists);
router.get('/todos', verifyToken, getTodos);

router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, upload.single('profileImage'), updateProfileValidation, updateProfile);

module.exports = router;