const User = require('../models/users');


module.exports.userSign = async (req, res, next) => {
  try {
    let { email, password, username } = req.body
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password)
    console.log(registerUser);
    req.login(registerUser, (err) => {
      if (err) {
        next(err);
      }
      req.flash("success", "Welcome to the AtithiStay")
      res.redirect("/listing");
    });
  }
  catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}

module.exports.userLogin = async (req, res) => {
  req.flash("success", "Welcome back to AtithiStay");
  const redirect = res.locals.redirectUrl || "/listing";
  res.redirect(redirect)
}

module.exports.userLogout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next(err)
    }
    req.flash("success", "Logout")
    res.redirect("/listing")
  })
}