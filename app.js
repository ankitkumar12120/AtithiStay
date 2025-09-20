if (process.env.NODE_ENV != "production") {
  require("dotenv").config()
}

console.log("Loaded MAPBOX_TOKEN =>", process.env.MAPBOX_TOKEN);


const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path') 
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError.js')

const listingRouter = require('./routes/listing.js')
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js')

const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/users.js')

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
})

store.on("error", () => {
  console.log("SESSION STORE ERROR", err)
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};



app.set('view engine', "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")))


main()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}


app.get("/", (req, res) => {
  res.redirect("/listing");
});

app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currUser = req.user;
  res.locals.mapToken = process.env.MAPBOX_TOKEN; // ✅ pass token
  next()
})


app.use("/listing", listingRouter)
app.use("/listing/:id/review", reviewRouter);
app.use("/", userRouter)


//Error handle

app.all(/.*/, (req, res, next) => {
  const err = new Error("Page not found");
  err.status = 404;
  next(err);
});


app.use((err, req, res, next) => {
  if (!err.status) err.status = 500;
  if (!err.message) err.message = "Something went wrong.";
  res.status(err.status).render("error", { err });
});


app.listen(8080, () => {
  console.log('Server is running on port 8080');
})