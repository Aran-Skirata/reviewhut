const express = require('express');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const Review = require("../models/review");
const Place = require("../models/place");
const reviewValidateSchema = require("../validations/reviewValidations");
const ExpressError = require("../utils/ExpressError");
const router = express.Router({mergeParams: true});

const validateReview = (req, res, next) => {
        const {error} = reviewValidateSchema.validate(req.body);
        if (error) {
                const msg = error.details.map((err) => err.message).join(",");
                throw new ExpressError(msg, 400);
        } else {
                next();
        }
}

router.post("/", validateReview, asyncErrorHandler(async (req, res) => {
        const {id} = req.params;
        const review = new Review(req.body.review);
        const place = await Place.findById(id);
        place.reviews.push(review);
        await review.save();
        await place.save();
        res.redirect(`/places/${id}`);
    })
);

//i need to delete reference and review itself
router.delete("/:reviewId", asyncErrorHandler(async (req, res) => {
        const {id, reviewId} = req.params;

        await Place.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/places/${id}`);
    })
);


module.exports = router;
