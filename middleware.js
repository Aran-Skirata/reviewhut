
const Place = require('./models/place');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');
const placeValidateSchema = require("./validations/placeValidations");
const reviewValidateSchema = require('./validations/reviewValidations');

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated())
    {
        req.session.returnTo = req.originalUrl;
        req.flash("error","You must be signed in");
        res.redirect('/login');
    }
    next();
}

module.exports.validatePlace = (req, res, next) => {

    const {error} = placeValidateSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((err) => err.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewValidateSchema.validate(req.body);
    if (error) {
            const msg = error.details.map((err) => err.message).join(",");
            throw new ExpressError(msg, 400);
    } else {
            next();
    }
}

module.exports.verifyOwner = async (req,res,next) => {

    const {id} = req.params;
    const place = await Place.findById(id)
    if(!place.owner.equals(req.user._id))
    {
        req.flash('error','Permission denied');
        res.redirect(`/places/${place._id}`);
    } else {
        next();
    }

}

module.exports.verifyReviewOwner = async (req,res,next) => {
    const {reviewId} = req.params;
    const review = await Review.findById(reviewId);
    console.log(review);
    if(!review.user.equals(req.user._id))
    {
        req.flash('error', 'Permission denied');
        res.redirect(`places/${review._id}`);
    } else {
        next();
    }
}