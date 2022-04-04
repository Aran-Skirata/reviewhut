const express = require("express");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const router = express.Router();
const userControllers = require("../controllers/users");

router
  .route("/register")
  .get(userControllers.renderRegisterForm)
  .post(asyncErrorHandler(userControllers.createNewUser));

router
  .route("/login")
  .get(userControllers.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    asyncErrorHandler(userControllers.loginUser)
  );

router.get("/logout", isLoggedIn, userControllers.logoutUser);

module.exports = router;
