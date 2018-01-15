// server.js

// set up ======================================================================
// the tools we need
var express = require("express");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var app = process.env.PORT || 8000;

var passport = require("passport");
var flash = require("connect-flash");
var multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toJSON().slice(0,10) + file.originalname);
  }
});
const upload = multer({ storage: storage });

// configuration ===============================================================
// connect to our database

require("./config/passport")(passport); // pass passport for configuration

// set up our express application
app.use(cookieParser()); // read cookies (needed for auth)
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs"); // set up ejs for templating

// required for passport
app.use(
  session({
    secret: "Guru works...",
    resave: true,
    saveUninitialized: true
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require("./app/routes.js")(app, passport, upload); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log("The magic happens on port " + port);
