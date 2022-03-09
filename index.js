const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Place = require("./models/place");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const asyncErrorHandler = require("./utils/AsyncErrorHandler");
const placeValidateSchema = require("./validations/placeValidations");

const uri =
  "mongodb+srv://SYSDBA:masterkey@cluster0.u96j0.mongodb.net/reviewhut?retryWrites=true&w=majority";
mongoose
  .connect(uri)
  .then(() => {
    console.log("Mongo connected succesfully");
  })
  .catch((err) => {
    console.log("Mongodb Error: ", err);
  });

const app = express();
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("tiny"));

const validatePlace = (req, res, next) => {

  const { error } = placeValidateSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/places",
  asyncErrorHandler(async (req, res) => {
    const places = await Place.find({});
    res.render("places/index", { places });
  })
);

app.post(
  "/places",
  validatePlace,
  asyncErrorHandler(async (req, res, next) => {
    const place = new Place(req.body.place);
    await place.save();
    res.redirect(`places/${place._id}`);
  })
);

app.get("/places/new", (req, res) => {
  res.render("places/new");
});

app.get(
  "/places/:id",
  asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    res.render("places/details", { place });
  })
);

app.patch(
  "/places/:id",
  validatePlace,
  asyncErrorHandler(async (req, res) => {
    const { id } = req.params;

    const place = await Place.findByIdAndUpdate(id, req.body.place);
    res.redirect(`/places/${place._id}`);
  })
);

app.delete(
  "/places/:id",
  asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findByIdAndDelete(id);

    res.redirect("/places");
  })
);

app.get(
  "/places/:id/edit",
  asyncErrorHandler(async (req, res) => {
    const { id } = req.params;
    const place = await Place.findById(id);
    res.render(`places/edit`, { place });
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  res.status(status).render("error", { err });
});

app.listen(3000, '0.0.0.0', () => {
  console.log("listening on port 3000");
});
