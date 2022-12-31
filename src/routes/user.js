const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const asyncHandler = require('../middleware/async');

// Route to register Tour Guides and User 
router.post('/register', asyncHandler(userController.register));

router.post('/login', asyncHandler(userController.login));


module.exports = router;
