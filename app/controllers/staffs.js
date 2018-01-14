var mysql = require("mysql");
var dbconfig = require("../../config/database");
var connection = mysql.createConnection(dbconfig.connection);
connection.query("USE " + dbconfig.database);

exports.signup = (req, res) => {
  res.render("staff12.ejs");
};
exports.login = (req, res) => {
  res.render("stafflogin.ejs");
};
exports.home = (req, res) => {
  connection.query(
    "SELECT * FROM staffs WHERE username = ?",
    [req.user.username],
    (err, user) => {
      if (err) {
        res.render("stafflogin", { error: "Enter a valid register number" });
      }
      console.log(user[0]);
      res.render("staffpage", { item: user[0] });
    }
  );
};
exports.markEntry = (req, res) => {
  res.render("markentry.ejs");
};
exports.searchStudent = (req, res) => {
  if (req.body.search) {
    connection.query(
      "SELECT * FROM users WHERE username = ?",
      [req.body.search],
      (err, user) => {
        if (err) {
          res.render("staffpage", { error: "Enter a valid register number" });
        }
        console.log(user[0]);
        res.render("searchstudent", { item: user[0] });
      }
    );
  } else {
    res.render("staffpage", {
      error: "Enter a valid register number",
      item: req.user
    });
  }
};
exports.saveMark = (req, res) => {
  if (req.body.regNo && req.body.sem && req.body.sub1) {
    req.body.sub4 ? console.log(req.body.sub4) : console.log("-")
    connection.query(
      `INSERT INTO marks
        (reg_no, semester, internal, dept, sub1, sub2, sub3, sub4, sub5, sub6, sub1_name, sub2_name, sub3_name, sub4_name, sub5_name, sub6_name)
        values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        req.body.regNo,
        req.body.sem,
        req.body.int,
        req.body.dept,
        req.body.sub1,
        req.body.sub2,
        req.body.sub3,
        req.body.sub4 ? req.body.sub4 : null,
        req.body.sub5 ? req.body.sub5 : null,
        req.body.sub6 ? req.body.sub6 : null,
        req.body.code1,
        req.body.code2,
        req.body.code3,
        req.body.code4 ? req.body.code4 : null,
        req.body.code5 ? req.body.code5 : null,
        req.body.code6 ? req.body.code6 : null
      ],
      (err, added) => {
        if (err) {
          console.log(err);
          res.render("markentry", { error: "Enter a valid register number" });
        } else {
          console.log(added);
          res.render("markentry", { error: "Marks entered successfully" });
        }
      }
    );
  } else {
    res.render("markentry", {
      error: "Enter a valid register number and specify the semester"
    });
  }
};
