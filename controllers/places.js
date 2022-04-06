const Place = require("../models/place");
const {cloudinary} = require('../cloudinary');

module.exports.index = async (req, res) => {
  const places = await Place.find({});
  res.render("places/index", { places });
};

module.exports.createPlace = async (req, res) => {
  console.log(req.body.place);
  const place = new Place(req.body.place);
  place.images = req.files.map(f => ({url: f.path, filename: f.filename}));
  place.owner = req.user._id;
  console.log(place);
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
  console.log(req.body);
  const place = await Place.findById(id);
  if (!place) {
    req.flash("error", "Place not found");
    res.redirect(`/places`);
  } else {
    if(req.body.deleteImages)
    {
        for(let filename of req.body.deleteImages)
        {
          await cloudinary.uploader.destroy(filename);
        }
        await place.update({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    const images = req.files.map(f => ({url: f.path, filename: f.filename}));
    await place.update(req.body.place);
    place.images.push(...images);
    await place.save();
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
