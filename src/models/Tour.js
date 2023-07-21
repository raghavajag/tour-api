const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for the tour'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description for the tour'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price for the tour'],
    },
    duration: {
        type: Number,
        required: [true, 'Please provide a duration for the tour'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'Please provide a max group size for the tour'],
    },
    ratingsAverage: {
        type: Number,
        default: 0,
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    images: [String],
    startDates: [Date],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    startLocation: {
        // GeoJSON
        type: {
            type: String,
        },
        coordinates: [Number],
        address: String,
        description: String,
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number,
        },
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
        },
    ],
    creator: {
        type: mongoose.Schema.ObjectId,
        ref: "Users"
    }
});

tourSchema.index({ startLocation: '2dsphere' });

const Tour = mongoose.model('Tours', tourSchema);

module.exports = Tour;
