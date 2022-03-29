const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const Place = require("../models/place");
const placeValidateSchema = require("../validations/placeValidations");
const ExpressError = require("../utils/ExpressError");
const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware');


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
    isLoggedIn,
    validatePlace,
    asyncErrorHandler(async (req, res, next) => {
        const place = new Place(req.body.place);
        await place.save();
        req.flash('success', "Succesfully created new place");
        res.redirect(`places/${place._id}`);
    })
);

router.get("/new", isLoggedIn, (req, res) => {
    res.render("places/new")
});

router.get(
    "/:id",
    asyncErrorHandler(async (req, res) => {
        const {id} = req.params;
        const place = await Place.findById(id).populate('reviews');
        if(!place){
            req.flash('error', "Place not found");
            res.redirect('/places');
        } else {
            res.render("places/details", {place});
        }
    })
);

router.patch(
    "/:id",
    validatePlace,
    isLoggedIn,
    asyncErrorHandler(async (req, res) => {
        const {id} = req.params;

        const place = await Place.findByIdAndUpdate(id, req.body.place);
        if(!place)
        {
            req.flash('error', "Place not found");
            res.redirect(`/places`);
        } else {
            req.flash('success', "Succesfully updated existing place");
            res.redirect(`/places/${place._id}`);
        }
    })
);

router.delete(
    "/:id",
    isLoggedIn,
    asyncErrorHandler(async (req, res) => {
        const {id} = req.params;
        const place = await Place.findByIdAndDelete(id);
        req.flash('success', "Succesfully deleted place");
        res.redirect("/places");
    })
);

router.get(
    "/:id/edit",
    isLoggedIn,
    asyncErrorHandler(async (req, res) => {
        const {id} = req.params;
        const place = await Place.findById(id);
        if(!place)
        {
            req.flash('error', "Place not found");
            res.redirect('/places');
        } else {
            res.render(`places/edit`, {place});
        }
    })
);

module.exports = router;