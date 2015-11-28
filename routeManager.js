/**
 * Created by AltonjiC on 9/26/15.
 */
var express = require('express');
var path = __dirname + '/views/';

// app/routes.js
module.exports = function(app, passport) {

	app.get("/", function(req,res) {
		res.render("index.ejs");
	});

	app.get("/login", function(req,res) {
		res.render("login.ejs", { message: req.flash('loginMessage') });
	});

	/* receive login data, check database for login info */
	app.post("/login", passport.authenticate('local-customer-login', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the login page if there is an error
        failureFlash : true // allow flash messages
    }));

	app.get("/register", function(req,res) {
		res.render('registration.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
    app.post('/register', passport.authenticate('local-customer-signup', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/register', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

	app.get("/home", isLoggedIn, function(req,res) {
		res.render("customer/customer_home.ejs");
	});

	// =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}