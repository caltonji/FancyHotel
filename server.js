var express = require("express");
var app = express();
// var router = express.Router();
var morgan = require('morgan');
var mysql = require("mysql");
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');


app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(__dirname + '/public/'));

require('./config/passport')(passport); // pass passport for configuration



app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// required for passport
app.use(session({ secret: 'chrisallisonomarkelcy' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./routeManager.js')(app, passport); // load our routes and pass in our app and fully configured passport


/**
 * Event listener for HTTP server "listening" event.
 */
app.listen(3004,function(){
  console.log("Live at Port 3004");
});


