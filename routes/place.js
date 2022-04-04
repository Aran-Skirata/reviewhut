const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const express = require("express");
const router = express.Router();
const { isLoggedIn, verifyOwner, validatePlace } = require("../middleware");
const Place = require("../models/place");

router.get(
  "/",
  asyncErrorHandler(async (req, res) => {
    const places = await Place.find({});
    res.render("places/index", { places });
  })
);

router.post(
  "/",
  isLoggedIn,
  validatePlace,
  asyncErrorHandler(async (req, res, next) => {
    const place = new Place(req.body.place);
    place.owner = req.user._id;
    await place.save();
    req.flash("success", "Succesfully created new place");
    res.redirect(`places/${place._id}`);
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("places/new");
});

router.get(
  "/:id",
  asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id)
      .populate({ path: "reviews", populate: { path: 'user' } })
      .populate("owner");
    console.log(place);
    if (!place) {
      req.flash("error", "Place not found");
      res.redirect("/places");
    } else {
      res.render("places/details", { place });
    }
  })
);

router.patch(
  "/:id",
  validatePlace,
  isLoggedIn,
  verifyOwner,
  asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) {
      req.flash("error", "Place not found");
      res.redirect(`/places`);
    } else {
      await place.update(req.body.place);
      req.flash("success", "Succesfully updated existing place");
      res.redirect(`/places/${place._id}`);
    }
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  verifyOwner,
  asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    req.flash("success", "Succesfully deleted place");
    res.redirect("/places");
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  verifyOwner,
  asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) {
      req.flash("error", "Place not found");
      res.redirect(`/places`);
    } else {
      res.render(`places/edit`, { place });
    }
  })
);

module.exports = router;
