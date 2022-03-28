const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Place = require("./models/place");
const Review = require("./models/review");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const asyncErrorHandler = require("./utils/AsyncErrorHandler");
const placeValidateSchema = require("./validations/placeValidations");
const reviewValidateSchema = require("./validations/reviewValidations");
const session = require("express-session");
const flash = require("connect-flash");

const reviewRoutes = require('./routes/review');
const placeRoutes = require('./routes/place');
const userRoutes = require('./routes/user');
const { Session } = require("inspector");


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
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname,'public')));
app.use(session({
    secret: "thisisnotagoodsecret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}));
app.use(flash());

app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/places/:id/review', reviewRoutes);
app.use('/places',placeRoutes);
app.use('/user',userRoutes);


app.get("/", asyncErrorHandler(async (req, res) => {
    const places = (await Place.find({}).limit(3));
    res.render("home", {places});
}));

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
    const {status = 500} = err;
    res.status(status).render("error", {err});
});

app.listen(3000, '0.0.0.0', () => {
    console.log("listening on port 3000");
});
