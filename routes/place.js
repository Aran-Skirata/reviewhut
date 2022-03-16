const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const Place = require("../models/place");
const placeValidateSchema = require("../validations/placeValidations");
const ExpressError = require("../utils/ExpressError");
const express = require('express');
const router = express.Router();

const validatePlace = (req, res, next) => {

    const {error} = placeValidateSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((err) => err.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


router.get(
    "/",
    asyncErrorHandler(async (req, res) => {
        const places = await Place.find({});
        res.render("places/index", {places});
    })
);

router.post(
    "/",
    validatePlace,
    asyncErrorHandler(async (req, res, next) => {
        const place = new Place(req.body.place);
        await place.save();
        res.redirect(`places/${place._id}`);
    })
);

router.get("/new", (req, res) => {
    res.render("places/new");
});

router.get(
    "/:id",
    asyncErrorHandler(async (req, res) => {
        const {id} = req.params;
        const place = await Place.findById(id).populate('reviews');
        res.render("places/details", {place});
    })
);

router.patch(
    "/:id",
    validatePlace,
    asyncErrorHandler(async (req, res) => {
        const {id} = req.params;

        const place = await Place.findByIdAndUpdate(id, req.body.place);
        res.redirect(`/places/${place._id}`);
    })
);

router.delete(
    "/:id",
    asyncErrorHandler(async (req, res) => {
        const {id} = req.params;
        await Place.findByIdAndDelete(id);

        res.redirect("/places");
    })
);

router.get(
    "/:id/edit",
    asyncErrorHandler(async (req, res) => {
        const {id} = req.params;
        const place = await Place.findById(id);
        res.render(`places/edit`, {place});
    })
);

module.exports = router;