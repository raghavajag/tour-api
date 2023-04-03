const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tour');
const asyncHandler = require('../middleware/async');
const { validateBody, validateParams } = require('../middleware/validateSchema')
const { createTourSchema, tourIdSchema, updateTourSchema } = require('../utils/schema')
const { authorize, protect } = require('../middleware/auth')

router.post('/', protect, authorize("admin"), validateBody(createTourSchema), asyncHandler(tourController.createTour))
router.get('/', asyncHandler(tourController.getAllTours))
router.delete('/:tourId', validateParams(tourIdSchema), asyncHandler(tourController.deleteTour))
router.put("/:tourId", validateParams(tourIdSchema), validateBody(updateTourSchema), asyncHandler(tourController.updateTour))
module.exports = router;