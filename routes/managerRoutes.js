var express = require('express');
var mysql = require('mysql');
var flash = require('connect-flash');
var session = require('express-session');

var connection = mysql.createConnection({
  host: "academic-mysql.cc.gatech.edu",
  user: "cs4400_Group_6",
  password: "tEVtJmV_",
  database : "cs4400_Group_6"
});
//just never let the connection
connection.connect()
