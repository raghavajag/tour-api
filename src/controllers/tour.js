const Tour = require("../models/Tour");
const ErrorResponse = require("../utils/ErrorResponse");
const APIFeatures = require("../utils/ApiFeatures");
const allowedFields = {
    creator: ["id", "name", "email"],
    tours: [
        "id",
        "name",
        "description",
        "price",
        "duration",
        "maxGroupSize",
        "ratingsAverage",
        "ratingsQuantity",
        "locations",
        "creator",
        "startLocation",
        "startDates",
        "createdAt",
        "images"
    ],
};
exports.createTour = async function (req, res) {
    const tour = await Tour.create({
        ...req.body,
        creator: req.user.id,
    });
    await tour.save();
    return res.status(201).json({ data: tour, success: true });
};
exports.getAllTours = async function (req, res) {
    const features = new APIFeatures(
        Tour.find(),
        req.query,
        "tours",
        allowedFields,
    )
        .filter()
        .limitFields()
        .paginate()
        .sort();
    const tours = await features.query;

    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours,
        },
    });
};

exports.deleteTour = async function (req, res, next) {
    const tour = await Tour.findByIdAndDelete(req.params.tourId);
    if (!tour) {
        return next(
            new ErrorResponse(`Tour not found with id of ${req.params.id}`, 404)
        );
    }
    res.status(200).json({ success: true, data: {} });
};
exports.updateTour = async function (req, res, next) {
    const tour = await Tour.findByIdAndUpdate(req.params.tourId, req.body, {
        new: true,
        runValidators: true,
    });
    if (!tour) {
        return next(
            new ErrorResponse(`Tour not found with id of ${req.params.id}`, 404)
        );
    }
    res.status(200).json({ success: true, data: tour });
};
