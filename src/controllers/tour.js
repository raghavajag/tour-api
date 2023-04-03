const Tour = require("../models/Tour");
const ErrorResponse = require("../utils/ErrorResponse");

exports.createTour = async function (req, res) {
    const tour = await Tour.create({
        ...req.body,
        creator: req.user.id
    })
    await tour.save();
    return res.status(201).json({ data: tour, success: true })
}
exports.getAllTours = async function (req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const tours = await Tour.find({}, {}, { skip: startIndex, limit }).sort("-createdAt");
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours,
        },
    });
}

exports.deleteTour = async function (req, res, next) {
    const tour = await Tour.findByIdAndDelete(req.params.tourId);
    if (!tour) {
        return next(new ErrorResponse(`Tour not found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: {} });
}
exports.updateTour = async function (req, res, next) {
    const tour = await Tour.findByIdAndUpdate(req.params.tourId, req.body, {
        new: true,
        runValidators: true,
    });
    if (!tour) {
        return next(new ErrorResponse(`Tour not found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: tour });
}