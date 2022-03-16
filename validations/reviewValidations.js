const Joi = require('joi');

const reviewValidationsSchema = Joi.object({
        review: Joi.object({
            body: Joi.string().max(500).required(),
            rating: Joi.number().min(1).max(5).required(),
        }).required(),
    }
)

module.exports = reviewValidationsSchema;