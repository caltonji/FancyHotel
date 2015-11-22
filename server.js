var express = require("express");
var app = express();
var router = express.Router();

app.use(express.static(__dirname + '/public/'));

/* route manager */
var routes = require('./routeManager');
/* look inn route manager for routes */
app.use('/', routes);

/**
 * Event listener for HTTP server "listening" event.
 */
app.listen(3004,function(){
  console.log("Live at Port 3004");
});

var mysql = require("mysql");


// First you need to create a connection to the db
var con = mysql.createConnection({
  host: "https://academic-mysql.cc.gatech.edu/",
  user: "cs4400_Group_6",
  password: "tEVtJmV_"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    console.log(err);
    return;
  }
  console.log('Connection established');
});

con.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});