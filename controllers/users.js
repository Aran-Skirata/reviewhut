const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("user/register");
};

module.exports.createNewUser = async (req, res, next) => {
  try {
    const user = new User(req.body.user);
    const newUsr = await User.register(user, req.body.password);
    req.login(newUsr, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome!");
      res.redirect("/login");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("user/login");
};

module.exports.loginUser = async (req, res) => {
  req.flash("success", "Welcome back!");
  const returnTo = req.session.returnTo || "/";
  delete req.session.returnTo;
  res.redirect(returnTo);
};

module.exports.logoutUser = (req, res) => {
  req.logOut();
  req.flash("success", "See you soon!");
  res.redirect("/");
};
