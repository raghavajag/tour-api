const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const createTourSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    duration: Joi.number().required(),
    maxGroupSize: Joi.number().required(),
    ratingsAverage: Joi.number().default(0),
    ratingsQuantity: Joi.number().default(0),
    images: Joi.array().items(Joi.string()),
    startDates: Joi.array().items(Joi.date()),
    startLocation: Joi.object({
        type: Joi.string().default('Point').valid('Point'),
        coordinates: Joi.array().items(Joi.number()).length(2),
        address: Joi.string(),
        description: Joi.string(),
    }),
    locations: Joi.array().items(
        Joi.object({
            type: Joi.string().default('Point').valid('Point'),
            coordinates: Joi.array().items(Joi.number()).length(2),
            address: Joi.string(),
            description: Joi.string(),
            day: Joi.number(),
        })
    ),
    guides: Joi.array().items(Joi.string()),
});
const updateTourSchema = Joi.object({
    name: Joi.string().empty(),
    description: Joi.string().empty(),
    price: Joi.number().min(0),
    duration: Joi.number().min(1),
    maxGroupSize: Joi.number().min(1),
    ratingsAverage: Joi.number().min(0).max(5),
    ratingsQuantity: Joi.number().min(0),
    images: Joi.array().items(Joi.string().uri()),
    startDates: Joi.array().items(Joi.date()),
    startLocation: Joi.object({
        type: Joi.string().required(),
        coordinates: Joi.array().items(Joi.number()).length(2).required(),
        address: Joi.string().empty().required(),
        description: Joi.string().empty(),
    }),
    locations: Joi.array().items(
        Joi.object({
            type: Joi.string().required(),
            coordinates: Joi.array().items(Joi.number()).length(2).required(),
            address: Joi.string().empty().required(),
            description: Joi.string().empty(),
            day: Joi.number().min(1).required(),
        })
    ),
    guides: Joi.array().items(Joi.string().hex().length(24)),
    creator: Joi.string().hex().length(24),
});

const tourIdSchema = Joi.object({
    tourId: Joi.objectId().required()
});

module.exports = {
    createTourSchema, tourIdSchema, updateTourSchema
}