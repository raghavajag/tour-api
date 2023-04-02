const Tour = require("../models/Tour")

exports.createTour = async function (req, res) {
    console.log(req.user);
    const tour = await Tour.create({
        ...req.body,
        creator: req.user.id
    })
    await tour.save();
    return res.status(201).json({ data: tour, success: true })
}