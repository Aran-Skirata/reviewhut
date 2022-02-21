const Joi = require("joi");

const placeValidationSchema = Joi.object({
  place: Joi.object({
    title: Joi.string().alphanum().min(5).max(30).required(),
    price: Joi.number().precision(2).sign("positive").required(),
    description: Joi.string().alphanum().max(500),
    location: Joi.string().alphanum(),
  }).required(),
});

module.exports = placeValidationSchema;
