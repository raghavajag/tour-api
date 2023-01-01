const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const asyncHandler = require('../middleware/async');
const { protect } = require('../middleware/auth');

// Route to register Tour Guides and User 
router.post('/register', asyncHandler(authController.register));

router.post('/login', asyncHandler(authController.login));

router.get('/confirmemail', asyncHandler(authController.confirmEmail));

router.put('/updatepassword', protect, asyncHandler(authController.updatePassword));

router.post('/forgotpassword', asyncHandler(authController.forgotPassword));

router.put('/resetpassword/:resettoken', asyncHandler(authController.resetPassword));



module.exports = router;
