// app/routes.js
var mysql = require("mysql");
var dbconfig = require("../config/database");
var connection = mysql.createConnection(dbconfig.connection);
connection.query("USE " + dbconfig.database);
var staffAuthCtrl = require("./controllers/staffs");

module.exports = function(app, passport, upload) {
  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get("/", function(req, res) {
    res.render("index.ejs"); // load the index.ejs file
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  app.get("/login", function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/studentlogin",
    passport.authenticate("local-login", {
      successRedirect: "/home", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    }),
    function(req, res) {
      console.log("hello");
      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
      } else {
        req.session.cookie.expires = false;
      }
      res.redirect("/");
    }
  );

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get("/studentsignup", function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render("students.ejs", {
      error: req.flash("signupMessage")
    });
  });

  // process the signup form
  app.post(
    "/studentsignup",
    upload.single("pic"),
    passport.authenticate("local-signup", {
      successRedirect: "/home", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );
  app.post("/student", upload.single("pic"), (req, res) => {
    res.json(req.body);
  });

  // ==================================================
  // PROFILE SECTION ==================================
  // ==================================================
  app.get("/profile", function(req, res) {
    res.render("profile.ejs", {
      user: req.user // get the user out of session and pass to template
    });
  });

  app.get("/home", isLoggedIn, (req, res) => {
    connection.query(
      "SELECT * FROM users WHERE username = ?",
      [req.user.username],
      (err, user) => {
        if (err) {
          console.log(err);
          res.redirect("/");
        } else {
          res.render("home", { item: user[0] });
        }
      }
    );
  });
  //
  // ====================================
  // Edit profile =======================
  // ====================================
  app.get("/editstudent", isLoggedIn, (req, res) => {
    connection.query(
      "SELECT * FROM users WHERE username = ?",
      [req.user.username],
      (err, user) => {
        res.render("editpagestudent", { item: user[0] });
      }
    );
  });
  app.post("/editstudent", isLoggedIn, (req, res) => {
    // console.log(req.file);
    console.log(req.user.username);
    connection.query(
      "UPDATE users SET address=?, name=?, email=?, dob=?, phone=?, community=?, bloodGroup=?, aadharNumber=? WHERE username=?",
      [
        req.body.address,
        req.body.name,
        req.body.email,
        req.body.dob,
        req.body.phone,
        req.body.community,
        req.body.bloodGroup,
        req.body.aadharNumber,
        req.user.username
      ],
      (err, rows) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/home");
        }
      }
    );
  });
  app.post(
    "/student/uploadPic",
    isLoggedIn,
    upload.single("pic"),
    (req, res) => {
      connection.query(
        "UPDATE users SET pic=? WHERE username=?",
        [
          new Date().toJSON().slice(0, 10) + req.file.originalname,
          req.user.username
        ],
        (err, rows) => {
          if (err) {
            console.log(err);
          }
          res.redirect("/editstudent");
        }
      );
    }
  );
  app.get("/bluecard", isLoggedIn, (req, res) => {
    if (req.user.username) {
      connection.query(
        `SELECT * FROM marks WHERE reg_no=${req.user.username}`,
        (err, rows) => {
          if (err) {
            console.log(err);
            res.render("home", { item: req.user });
          }
          console.log(rows);
          res.render("studentBluecard", { item: rows });
        }
      );
    } else {
      res.render("home", { item: req.user });
    }
  });
  // =========================================================
  // ================== Staffs routes ========================
  app.get("/staffs/signup", staffAuthCtrl.signup);
  app.post(
    "/staffs/signup",
    upload.single("pic"),
    passport.authenticate("staff-signup", {
      successRedirect: "/staffs/home", // redirect to the secure profile section
      failureRedirect: "/staffs/signup", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );
  app.get("/staffs/login", staffAuthCtrl.login);
  app.post(
    "/staffs/login",
    passport.authenticate("staff-login", {
      successRedirect: "/staffs/home", // redirect to the secure profile section
      failureRedirect: "/staffs/login", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );
  app.get("/staffs/home", isStaffLoggedIn, staffAuthCtrl.home);
  app.get("/staffs/markentry", isStaffLoggedIn, staffAuthCtrl.markEntry);
  app.post(
    "/staffs/searchStudent",
    isStaffLoggedIn,
    staffAuthCtrl.searchStudent
  );
  app.post("/staffs/markentry", isStaffLoggedIn, staffAuthCtrl.saveMark);

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();

  // if they aren't redirect them to the home page
  res.redirect("/");
}
function isStaffLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  console.log(req.user);
  if (req.isAuthenticated() && req.user.role) return next();

  // if they aren't redirect them to the home page
  res.redirect("/staffs/login");
}
