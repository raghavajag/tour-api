const Joi = require('joi')

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


module.exports = {
    createTourSchema
}