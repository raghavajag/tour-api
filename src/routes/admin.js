const express = require('express');
const { protect, authorize } = require("../middleware/auth");
const asyncHandler = require('../middleware/async');
const router = express.Router();
const adminController = require('../controllers/admin');

router.use(protect);
// check if user is admin
router.use(authorize('admin'));

router.post('/productKey', asyncHandler(adminController.getProductkey))

module.exports = router;
