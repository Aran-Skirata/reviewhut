const express = require("express");
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const router = express.Router({ mergeParams: true });
const {
  isLoggedIn,
  validateReview,
  verifyReviewOwner,
} = require("../middleware");
const reviewControllers = require("../controllers/reviews");

router
  .route("/")
  .get(reviewControllers.redirectDetails)
  .post(
    isLoggedIn,
    validateReview,
    asyncErrorHandler(reviewControllers.createReview)
  );

router.delete(
  "/:reviewId",
  isLoggedIn,
  verifyReviewOwner,
  asyncErrorHandler(reviewControllers.deleteReview)
);

module.exports = router;
