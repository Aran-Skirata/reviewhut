const Place = require("../models/place");

module.exports.index = async (req, res) => {
  const places = await Place.find({});
  res.render("places/index", { places });
};

module.exports.createPlace = async (req, res, next) => {
  const place = new Place(req.body.place);
  place.owner = req.user._id;
  await place.save();
  req.flash("success", "Succesfully created new place");
  res.redirect(`places/${place._id}`);
};

module.exports.renderNewForm = (req, res) => {
  res.render("places/new");
};

module.exports.renderPlaceDetails = async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id)
    .populate({ path: "reviews", populate: { path: "user" } })
    .populate("owner");
  if (!place) {
    req.flash("error", "Place not found");
    res.redirect("/places");
  } else {
    res.render("places/details", { place });
  }
};

module.exports.updatePlace = async (req, res) => {
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
};

module.exports.deletePlace = async (req, res) => {
  const { id } = req.params;
  await Place.findByIdAndDelete(id);
  req.flash("success", "Succesfully deleted place");
  res.redirect("/places");
};

module.exports.renderPlaceEditForm = async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);
  if (!place) {
    req.flash("error", "Place not found");
    res.redirect(`/places`);
  } else {
    res.render(`places/edit`, { place });
  }
};
