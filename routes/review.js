const express = require('express');
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const Review = require("../models/review");
const Place = require("../models/place");
const router = express.Router({mergeParams: true});
const {isLoggedIn, validateReview, verifyReviewOwner} = require("../middleware");


router.post("/", isLoggedIn, validateReview, asyncErrorHandler(async (req, res) => {
        const {id} = req.params;
        const review = new Review(req.body.review);
        review.user = req.user._id;
        const place = await Place.findById(id);
        place.reviews.push(review);
        await review.save();
        await place.save();
        req.flash("success", "review created successfully");
        res.redirect(`/places/${id}`);
    })
);

//i need to delete reference and review itself
router.delete("/:reviewId", isLoggedIn, verifyReviewOwner ,asyncErrorHandler(async (req, res) => {
        const {id, reviewId} = req.params;

        await Place.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', "review deleted succesfully");
        res.redirect(`/places/${id}`);
    })
);


module.exports = router;
