const Joi = require('joi');
const listing = require('./models/listing.js');
const review = require('./models/review.js');
const user = require('./models/user.js');

module.exports.listingSchema = Joi.object({
    
    Listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            filename: Joi.string(),
            url: Joi.string().allow("", null),
          }),
        //image: Joi.string().uri().optional()
        //image:  Joi.string().allow("", null),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required().min(0).max(5),
    }).required(),
});

module.exports.userSchema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required()
});