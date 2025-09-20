const express = require('express')
const router = express.Router()
const User = require('../models/users');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const { userSign, userLogin, userLogout } = require('../controllers/user');
const { route } = require('./review');


router.route("/signup")
  .get((req, res) => {
    res.render("users/signup");
  })
  .post(wrapAsync(userSign));



router.route("/login")
  .get((req, res) => {
    res.render("users/login.ejs");
  })
  .post(
    saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),
    userLogin
  )

// router.get("/signup", (req, res) => {
//   res.render("users/signup");
// });


// router.post("/signup", wrapAsync(userSign));

// router.get("/login", (req, res) => {
//   res.render("users/login.ejs");
// })

// router.post("/login",
//   saveRedirectUrl,
//   passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),
//   userLogin
// )


router.get("/logout", userLogout)

module.exports = router