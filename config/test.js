var mysql = require("mysql");
var dbconfig = require("./database");

var connection = mysql.createConnection(dbconfig.connection);
connection.query("USE " + dbconfig.database);

connection.query("SELECT * FROM users", null, (err, user) => {
  var q = user[0].dob.toString();
  console.log(q);
  var a = user[0].dob.toISOString().slice(0, 10);

  console.log(a);
});
