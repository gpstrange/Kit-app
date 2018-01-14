/**
 * Created by barrett on 8/28/14.
 */

var mysql = require("mysql");
var dbconfig = require("../config/database");

var connection = mysql.createConnection(dbconfig.connection);

// connection.query("CREATE DATABASE " + dbconfig.database);

connection.query(
  "\
CREATE TABLE `" +
    dbconfig.database +
    "`.`" +
    dbconfig.users_table +
    "` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(20) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
    `email` VARCHAR(20) NOT NULL,\
    `dept` CHAR(60) NOT NULL,\
    `phone` INT NOT NULL,\
    `aadharNumber` BIGINT NOT NULL,\
    `pic` VARCHAR,\
    `dob` DATE NOT NULL,\
    `address` VARCHAR(255) NOT NULL,\
    `bloodGroup` VARCHAR(20) NOT NULL,\
    `community` VARCHAR(20) NOT NULL,\
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
)"
);

console.log("Success: Database Created!");

connection.end();
