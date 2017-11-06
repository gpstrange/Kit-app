var ejs = require("ejs"),
  bcrypt = require("bcrypt"),
  crypto = require("crypto"),
  express = require("express"),
  jwt = require("jsonwebtoken"),
  passport = require("passport"),
  mongoose = require("mongoose"),
  user = require("./models/user"),
  flash = require("connect-flash"),
  bodyParser = require("body-parser"),
  passportLocal = require("passport-local"),
  expressSession = require("express-session"),
  expressValidator = require("express-validator"),
  passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/kit-app");
mongoose.Promise = global.Promise;
var app = express();
var MongoClient = require("mongodb").MongoClient;
var port = process.env.PORT || 5000;

app.use(passport.initialize());
app.use(passport.session());

app.use(
  require("express-session")({
    secret: "Guru did the app!",
    resave: false,
    saveUninitialized: false
  })
);
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

var multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

app.use(bodyParser.json());

app.use(flash());

var markSchema = new mongoose.Schema({
  name: String,
  regNo: Number,
  semester: Number,
  dept: String,
  int: String,
  sub1: Number,
  sub2: Number,
  sub3: Number,
  sub4: Number,
  sub5: Number,
  sub6: Number
});

var studentsSchema = new mongoose.Schema({
  name: String,
  address: String,
  email: String,
  regNo: { type: String, unique: true },
  dept: String,
  dob: String,
  mobile: String,
  bloodGroup: String,
  community: String,
  password: String,
  username: String,
  pic: String,
  marks: [markSchema]
});

// studentsSchema.methods.comparePassword = function(password) {
//   return bcrypt.compareSync(password, this.password);
// };
studentsSchema.plugin(passportLocalMongoose);

var students = mongoose.model("students", studentsSchema);

passport.use(new passportLocal(students.authenticate()));
passport.serializeUser(students.serializeUser());
passport.deserializeUser(students.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/students", (req, res) => {
  res.render("students");
});

app.post("/students", upload.single("pic"), (req, res) => {
  var name = req.body.name,
    address = req.body.address,
    mobile = req.body.mobile,
    dob = req.body.dob,
    email = req.body.email,
    regNo = req.body.regNo,
    pic = req.file.originalname,
    community = req.body.community,
    bloodGroup = req.body.bloodGroup,
    dept = req.body.dept,
    username = req.body.username;

  var Student = {
    name: name,
    address: address,
    email: email,
    regNo: regNo,
    dept: dept,
    bloodGroup: bloodGroup,
    community: community,
    dob: dob,
    mobile: mobile,
    username: username,
    pic: pic
  };
  req
    .assert("email", "Please check your email id")
    .notEmpty()
    .isEmail();
  req
    .assert("mobile", "Please check your mobile Number")
    .isNumeric()
    .len(10, 10);
  req
    .assert("pwd", "Password must be 5-20 characters")
    .notEmpty()
    .len(5, 20);
  req
    .assert("regNo", "RegisterNumber must be 12 characters")
    .notEmpty()
    .len(12, 12);
  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    return res.render("students", { error: JSON.stringify(errors) });
  }
  students.find({ regNo: req.body.regNo }, function(err, student) {
    if (err) {
      res.render("students", { error: "Something went wrong" });
    }
    if (student.length > 0) {
      res.render("students", {
        error: "The Register Number is already used by someone else"
      });
    } else {
      var newStudent = new students(Student);
      students.register(newStudent, req.body.pwd, (err, created) => {
        if (err) {
          console.log(err);
          res.render("students", { error: "Something went wrong" });
        }
        console.log(created);
        req.login({ regNo: regNo, password: req.body.pwd }, () => {
          console.log(req.user);
          res.redirect("/home");
        });
      });
    }
  });
});

app.get("/staffs", (req, res) => {
  res.render("stafflogin");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/editprofile", (req, res) => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (req.user) {
      var user = req.user;
      var emailVerify = user.email;
      MongoClient.connect(
        process.env.MONGODB_URI || "mongodb://localhost/kit-app",
        (err, db) => {
          db.collection("students", function(err, collection) {
            collection.find().toArray(function(err, items) {
              if (err) {
                res.redirect("/home");
              }
              var j = items.length;
              for (var i = 0; i < j; i++) {
                if (items[i].Email == emailVerify) {
                  var item = items[i];
                  res.render("editpagestudent", { item: item });
                }
              }
            });
            db.close();
          });
        }
      );
    } else {
      res.render("index", { error: "You must be logged in" });
    }
  });
});

app.post("/register", (req, res) => {
  var newUser = new user({ username: req.body.username, isAdmin: true });
  user.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/staffpage");
    });
  });
});

// app.post(
//   "/stafflogin",
//   passport.authenticate("local", {
//     successRedirect: "/staffpage",
//     failureRedirect: "/stafflog"
//   }),
//   (req, res) => {}
// );

app.get("/stafflog", (req, res) => {
  res.render("stafflogin", { error: "Please check your user credentials" });
});

app.get("/staffpage", isLoggedIn, (req, res) => {
  res.render("staffpage");
});

app.post("/login", (req, res) => {
  students.findOne(
    {
      email: req.body.username
    },
    function(err, user) {
      if (!user || !user.comparePassword(req.body.password)) {
        return res.send({
          status: 401,
          message: "Authentication failed. Invalid user or password."
        });
      }
      return res.redirect("/home");
    }
  );
});

app.get("/home", (req, res) => {
  // firebase.auth().onAuthStateChanged(function(user) {
  //   if (user) {
  //     var user = firebase.auth().currentUser;
  //     var emailVerify = user.email;
  //     MongoClient.connect(
  //       process.env.MONGODB_URI || "mongodb://localhost/kit-app",
  //       (err, db) => {
  //         db.collection("students", function(err, collection) {
  //           collection.find().toArray(function(err, items) {
  //             if (err) {
  //               res.send("Somthing went wrong");
  //             }
  //             var j = items.length;
  //             for (var i = 0; i < j; i++) {
  //               if (items[i].Email == emailVerify) {
  //                 var item = items[i];
  //                 res.render("home", { item: item });
  //               }
  //             }
  //           });
  //           db.close();
  //         });
  //       }
  //     );
  //   } else {
  //     res.render("index", { error: "You must be logged in" });
  //   }
  // });
  console.log(req.user);
  res.json(req.user);
});

app.post(
  "/editstudent",
  upload.single("pic"),
  (req, res) => {
    var user = firebase.auth().currentUser,
      userId = user.uid,
      Email = req.body.email,
      name = req.body.name,
      address = req.body.address,
      mobile = req.body.mobile,
      dob = req.body.dob,
      regNo = req.body.regNo,
      bloodGroup = req.body.bloodGroup,
      community = req.body.community,
      pic = req.file.originalname,
      dept = req.body.dept,
      username = req.body.username,
      password = req.body.pwd;
    var id = req.params.id;
    console.log(regNo);
    var item = {
      name: name,
      address: address,
      Email: Email,
      regNo: regNo,
      dept: dept,
      bloodGroup: bloodGroup,
      community: community,
      dob: dob,
      mobile: mobile,
      username: username,
      pic: pic
    };
    user
      .updatePassword(password)
      .catch(() => {
        res.render("editpagestudent", {
          error: "Password must be atleast 6 characters",
          item: item
        });
      })
      .then(function() {
        console.log("pwd sent.");
        firebase
          .database()
          .ref("users/" + userId)
          .update({
            name: name,
            email: Email,
            pic: pic,
            regNo: regNo,
            address: address,
            dept: dept,
            bloodGroup: bloodGroup,
            community: community,
            username: username,
            mobile: mobile,
            dob: dob
          })
          .then(() => {
            MongoClient.connect(
              process.env.MONGODB_URI || "mongodb://localhost/kit-app",
              (err, db) => {
                db.collection("students", function(err, collection) {
                  collection.findOneAndUpdate(
                    { regNo: regNo },
                    {
                      $set: {
                        name: name,
                        address: address,
                        Email: Email,
                        regNo: regNo,
                        dept: dept,
                        bloodGroup: bloodGroup,
                        community: community,
                        dob: dob,
                        mobile: mobile,
                        username: username,
                        pic: pic
                      }
                    },
                    { returnOriginal: false, upsert: true },
                    (err, item) => {
                      console.log(item.value);
                      res.render("home", { item: item.value });
                    }
                  );
                  db.close();
                });
              }
            );
          });
      });
  },
  function(error) {
    // An error happened.
  }
);

app.post("/staffsearch", (req, res) => {
  var person = req.body.search;

  MongoClient.connect(
    process.env.MONGODB_URI || "mongodb://localhost/kit-app",
    function(err, db) {
      db.collection("students", function(err, collection) {
        collection.find().toArray(function(err, items) {
          if (err) {
            {
              res.send("404 : No results found");
            }
          }
          var j = items.length;
          var x = 0;
          for (var i = 0; i < j; i++) {
            if (items[i].regNo == person) {
              var item = items[i];
              res.render("searchstudent", { item: item });
            } else {
              x++;
              if (x == j) {
                res.render("staffpage", {
                  error: "Enter a valid register number"
                });
              }
            }
          }
          db.close();
        });
      });
    }
  );
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

//===============================================================================================================
//                                    BlueCard
//===============================================================================================================

app.get("/bluecard", (req, res) => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var user = firebase.auth().currentUser;
      var emailVerify = user.email;
      MongoClient.connect(
        process.env.MONGODB_URI || "mongodb://localhost/kit-app",
        (err, db) => {
          db.collection("students", function(err, collection) {
            collection
              .find({ Email: emailVerify })
              .toArray(function(err, items) {
                var j = items[0].marks.length;
                if (j == 0) {
                  res.redirect("/home");
                } else {
                  var x = items[0].marks.length - 1;
                  console.log(x);
                  var sems = items[0].marks[x].semester,
                    dept = items[0].marks[x].dept,
                    item = items[0];

                  if (sems == 1) {
                    res.render("student", {
                      item: item,
                      sub1: "English1",
                      sub2: "Mathematics1",
                      sub3: "Physics1",
                      sub4: "Chemistry1",
                      sub5: "ComputerProgramming",
                      sub6: "EngineeringGraphics"
                    });
                  } else if (sems == 2 && dept == "ece") {
                    res.render("student", {
                      item: item,
                      sub1: "English2",
                      sub2: "Mathematics2",
                      sub3: "Physics2",
                      sub4: "Chemistry2",
                      sub5: "CircuitTheory",
                      sub6: "ED"
                    });
                  } else if (sems == 2 && dept == "eee") {
                    res.render("student", {
                      item: item,
                      sub1: "English2",
                      sub2: "Mathematics2",
                      sub3: "Physics2",
                      sub4: "Chemistry2",
                      sub5: "CircuitTheory",
                      sub6: "BCME"
                    });
                  } else if (sems == 2 && dept == "cse") {
                    res.render("student", {
                      item: item,
                      sub1: "English2",
                      sub2: "Mathematics2",
                      sub3: "Physics2",
                      sub4: "DPSD",
                      sub5: "PCE",
                      sub6: "BCME"
                    });
                  } else if (sems == 2 && dept == "mech") {
                    res.render("student", {
                      item: item,
                      sub1: "English2",
                      sub2: "Mathematics2",
                      sub3: "Physics2",
                      sub4: "Chemistry2",
                      sub5: "BEEE",
                      sub6: "EM"
                    });
                  } else if (sems == 2 && dept == "aero") {
                    res.render("student", {
                      item: item,
                      sub1: "English2",
                      sub2: "Mathematics2",
                      sub3: "Physics2",
                      sub4: "Chemistry2",
                      sub5: "BEEE",
                      sub6: "EM"
                    });
                  } else if (sems == 3 && dept == "ece") {
                    res.render("student", {
                      item: item,
                      sub1: "MA6351",
                      sub2: "EE6352",
                      sub3: "EC6301",
                      sub4: "EC6302",
                      sub5: "EC6303",
                      sub6: "EC6304"
                    });
                  } else if (sems == 3 && dept == "eee") {
                    res.render("student", {
                      item: item,
                      sub1: "MA8357",
                      sub2: "GE8351",
                      sub3: "EE8301",
                      sub4: "EE8302",
                      sub5: "EC8304",
                      sub6: "EE8304"
                    });
                  } else if (sems == 3 && dept == "cse") {
                    res.render("student", {
                      item: item,
                      sub1: "MA6351",
                      sub2: "CS6301",
                      sub3: "CS6302",
                      sub4: "CS6303",
                      sub5: "CS6304",
                      sub6: "GE6351"
                    });
                  } else if (sems == 3 && dept == "mech") {
                    res.render("student", {
                      item: item,
                      sub1: "MA6351",
                      sub2: "CE6306",
                      sub3: "ME6301",
                      sub4: "CE6451",
                      sub5: "ME6302",
                      sub6: "EE6351"
                    });
                  } else if (sems == 3 && dept == "aero") {
                    res.render("student", {
                      item: item,
                      sub1: "MA6351",
                      sub2: "ME6352",
                      sub3: "AE6301",
                      sub4: "CE6451",
                      sub5: "CE6452",
                      sub6: "AE6302"
                    });
                  } else if (sems == 4 && dept == "ece") {
                    res.render("student", {
                      item: item,
                      sub1: "MA6451",
                      sub2: "EC6401",
                      sub3: "EC6402",
                      sub4: "EC6403",
                      sub5: "EC6404",
                      sub6: "EC6405"
                    });
                  } else if (sems == 4 && dept == "eee") {
                    res.render("student", {
                      item: item,
                      sub1: "EC8404",
                      sub2: "EE8402",
                      sub3: "EE8403",
                      sub4: "EE8404",
                      sub5: "EE8405",
                      sub6: "EE8406"
                    });
                  } else if (sems == 4 && dept == "cse") {
                    res.render("student", {
                      item: item,
                      sub1: "MA6453 ",
                      sub2: "CS6551",
                      sub3: "CS6401",
                      sub4: "CS6402",
                      sub5: "EC6504",
                      sub6: "CS6403"
                    });
                  } else if (sems == 4 && dept == "mech") {
                    res.render("student", {
                      item: item,
                      sub1: "MA6452",
                      sub2: "ME6401",
                      sub3: "ME6402",
                      sub4: "ME6403",
                      sub5: "GE6351",
                      sub6: "ME6404"
                    });
                  } else if (sems == 4 && dept == "aero") {
                    res.render("student", {
                      item: item,
                      sub1: "MA6459",
                      sub2: "AE6401",
                      sub3: "AE6402",
                      sub4: "AT6302",
                      sub5: "AE6403",
                      sub6: "AE6404"
                    });
                  } else if (sems > 4) {
                    res.render("student", {
                      item: item
                    });
                  }
                }
                db.close();
              });
          });
        }
      );
    } else {
      res.render("index", { error: "You must be logged in" });
    }
  });
});

app.post("/mark", (req, res) => {
  console.log("/mark");
  var name = req.body.name,
    regNo = req.body.regNo,
    semester = req.body.sem,
    dept = req.body.dept,
    int = req.body.int,
    sub1 = req.body.sub1,
    sub2 = req.body.sub2,
    sub3 = req.body.sub3,
    sub4 = req.body.sub4,
    sub5 = req.body.sub5,
    sub6 = req.body.sub6,
    code1 = req.body.code1,
    code2 = req.body.code2,
    code3 = req.body.code3,
    code4 = req.body.code4,
    code5 = req.body.code5,
    code6 = req.body.code6;

  var mark = {
    name: name,
    regNo: regNo,
    semester: semester,
    dept: dept,
    int: int,
    sub1: sub1,
    sub2: sub2,
    sub3: sub3,
    sub4: sub4,
    sub5: sub5,
    sub6: sub6
  };

  var maark = {
    name: name,
    regNo: regNo,
    semester: semester,
    dept: dept,
    int: int,
    sub1: code1 + " --- : --- " + sub1,
    sub2: code2 + " --- : ---" + sub2,
    sub3: code3 + " --- : ---" + sub3,
    sub4: code4 + " --- : ---" + sub4,
    sub5: code5 + " --- : ---" + sub5,
    sub6: code6 + " --- : ---" + sub6
  };
  console.log(maark);
  MongoClient.connect(
    process.env.MONGODB_URI || "mongodb://localhost/kit-app",
    function(err, db) {
      db.collection("students", function(err, collection) {
        console.log(maark);
        if (semester > 4) {
          collection
            .findOneAndUpdate({ regNo: regNo }, { $push: { marks: maark } })
            .then(() => {
              console.log(maark);
              res.render("markentry", { error: "Marks Saved" });
            });
        } else {
          collection
            .findOneAndUpdate({ regNo: regNo }, { $push: { marks: mark } })
            .then(() => {
              console.log(mark);
              res.render("markentry", { error: "Marks Saved" });
            });
        }
        db.close();
      });
    }
  );
});

app.get("/blue", isLoggedIn, (req, res) => {
  res.render("markentry");
});

app.get("/:id/academics", (req, res) => {
  var person = req.params.id;

  MongoClient.connect(
    process.env.MONGODB_URI || "mongodb://localhost/kit-app",
    function(err, db) {
      db.collection("students", function(err, collection) {
        collection.find({ regNo: person }).toArray(function(err, items) {
          if (err) {
            res.send("404 : No results found");
          }
          var j = items[0].marks.length;
          if (j == 0) {
            res.send("No Results Found");
          } else {
            var x = items[0].marks.length - 1;
            var sems = items[0].marks[x].semester,
              dept = items[0].marks[x].dept,
              item = items[0];
            if (sems == 1) {
              res.render("student", {
                item: item,
                sub1: "English1",
                sub2: "Mathematics1",
                sub3: "Physics1",
                sub4: "Chemistry1",
                sub5: "ComputerProgramming",
                sub6: "EngineeringGraphics"
              });
            } else if (sems == 2 && dept == "ece") {
              res.render("student", {
                item: item,
                sub1: "English2",
                sub2: "Mathematics2",
                sub3: "Physics2",
                sub4: "Chemistry2",
                sub5: "CircuitTheory",
                sub6: "ED"
              });
            } else if (sems == 2 && dept == "eee") {
              res.render("student", {
                item: item,
                sub1: "English2",
                sub2: "Mathematics2",
                sub3: "Physics2",
                sub4: "Chemistry2",
                sub5: "CircuitTheory",
                sub6: "BCME"
              });
            } else if (sems == 2 && dept == "cse") {
              res.render("student", {
                item: item,
                sub1: "English2",
                sub2: "Mathematics2",
                sub3: "Physics2",
                sub4: "DPSD",
                sub5: "PCE",
                sub6: "BCME"
              });
            } else if (sems == 2 && dept == "mech") {
              res.render("student", {
                item: item,
                sub1: "English2",
                sub2: "Mathematics2",
                sub3: "Physics2",
                sub4: "Chemistry2",
                sub5: "BEEE",
                sub6: "EM"
              });
            } else if (sems == 2 && dept == "aero") {
              res.render("student", {
                item: item,
                sub1: "English2",
                sub2: "Mathematics2",
                sub3: "Physics2",
                sub4: "Chemistry2",
                sub5: "BEEE",
                sub6: "EM"
              });
            } else if (sems == 3 && dept == "ece") {
              res.render("student", {
                item: item,
                sub1: "MA6351",
                sub2: "EE6352",
                sub3: "EC6301",
                sub4: "EC6302",
                sub5: "EC6303",
                sub6: "EC6304"
              });
            } else if (sems == 3 && dept == "eee") {
              res.render("student", {
                item: item,
                sub1: "MA8357",
                sub2: "GE8351",
                sub3: "EE8301",
                sub4: "EE8302",
                sub5: "EC8304",
                sub6: "EE8304"
              });
            } else if (sems == 3 && dept == "cse") {
              res.render("student", {
                item: item,
                sub1: "MA6351",
                sub2: "CS6301",
                sub3: "CS6302",
                sub4: "CS6303",
                sub5: "CS6304",
                sub6: "GE6351"
              });
            } else if (sems == 3 && dept == "mech") {
              res.render("student", {
                item: item,
                sub1: "MA6351",
                sub2: "CE6306",
                sub3: "ME6301",
                sub4: "CE6451",
                sub5: "ME6302",
                sub6: "EE6351"
              });
            } else if (sems == 3 && dept == "aero") {
              res.render("student", {
                item: item,
                sub1: "MA6351",
                sub2: "ME6352",
                sub3: "AE6301",
                sub4: "CE6451",
                sub5: "CE6452",
                sub6: "AE6302"
              });
            } else if (sems == 4 && dept == "ece") {
              res.render("student", {
                item: item,
                sub1: "MA6451",
                sub2: "EC6401",
                sub3: "EC6402",
                sub4: "EC6403",
                sub5: "EC6404",
                sub6: "EC6405"
              });
            } else if (sems == 4 && dept == "eee") {
              res.render("student", {
                item: item,
                sub1: "EC8404",
                sub2: "EE8402",
                sub3: "EE8403",
                sub4: "EE8404",
                sub5: "EE8405",
                sub6: "EE8406"
              });
            } else if (sems == 4 && dept == "cse") {
              res.render("student", {
                item: item,
                sub1: "MA6453 ",
                sub2: "CS6551",
                sub3: "CS6401",
                sub4: "CS6402",
                sub5: "EC6504",
                sub6: "CS6403"
              });
            } else if (sems == 4 && dept == "mech") {
              res.render("student", {
                item: item,
                sub1: "MA6452",
                sub2: "ME6401",
                sub3: "ME6402",
                sub4: "ME6403",
                sub5: "GE6351",
                sub6: "ME6404"
              });
            } else if (sems == 4 && dept == "aero") {
              res.render("student", {
                item: item,
                sub1: "MA6459",
                sub2: "AE6401",
                sub3: "AE6402",
                sub4: "AT6302",
                sub5: "AE6403",
                sub6: "AE6404"
              });
            } else if (sems > 4) {
              res.render("student", {
                item: item
              });
            }
          }
          db.close();
        });
      });
    }
  );
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.render("index", { error: "You must be logged in" });
  }
}

app.listen(port, () => {
  console.log("started at : " + port);
});
