const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const review = new Review(req.body.review);
  review.user = req.user._id;
  const place = await Place.findById(id);
  place.reviews.push(review);
  await review.save();
  await place.save();
  req.flash("success", "review created successfully");
  res.redirect(`/places/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Place.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "review deleted succesfully");
  res.redirect(`/places/${id}`);
};
