if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Place = require("./models/place");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const asyncErrorHandler = require("./utils/AsyncErrorHandler");
const session = require("express-session");
const flash = require("connect-flash");
const reviewRoutes = require('./routes/review');
const placeRoutes = require('./routes/place');
const userRoutes = require('./routes/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");

mongoose
    .connect(process.env.MONGO_URI)
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
    name: "_s",
    secret: "thisisnotagoodsecret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize());
// app.use(helmet());
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       default: [],
//       scriptSrc: ["'unsafe-inline'","'self'","https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"],
//       styleSrc: ["'self'","'unsafe-inline'","https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"],
//       imgSrc : ["'self'","blob:","data:","https://res.cloudinary.com/dr8m8qurw","https://picsum.photos"]
//     },
//   })
// );
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    next();
})

app.use('/places/:id/review', reviewRoutes);
app.use('/places',placeRoutes);
app.use('/',userRoutes);


app.get("/", asyncErrorHandler(async (req, res) => {
    console.log(req.query);
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
