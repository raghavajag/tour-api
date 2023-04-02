const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tour');
const asyncHandler = require('../middleware/async');
const validate = require('../middleware/validateSchema')
const { createTourSchema } = require('../utils/schema')
const { authorize, protect } = require('../middleware/auth')

router.post('/', protect, authorize("admin"), validate(createTourSchema), asyncHandler(tourController.createTour))


module.exports = router;