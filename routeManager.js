/**
 * Created by AltonjiC on 9/26/15.
 */
var express = require('express');
var path = __dirname + '/views/';

var customerRoutes = require('./routes/customerRoutes')

// app/routes.js
module.exports = function(app, passport) {
    //home
	app.get("/", function(req,res) {
		res.render("index.ejs");
	});

    //authentication get routes
	app.get("/login", function(req,res) {
		res.render("login.ejs", { message: req.flash('loginMessage') });
	});

    app.get("/register", function(req,res) {
        res.render('registration.ejs', { message: req.flash('signupMessage') });
    });

    //authentication post routes
	app.post("/login", passport.authenticate('local-customer-login', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the login page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/register', passport.authenticate('local-customer-signup', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/register', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    //customer get routes
		app.get("/home", isLoggedIn, function(req,res) {
			res.render("customer/customer_home.ejs", { username: req.user.Username});
		});

    app.get("/findRoom", isLoggedIn, function(req,res) {
        res.render("customer/find_room.ejs", { message: req.flash('reservationMessage') });
    });

	app.get("/availablerooms", function(req,res) {
        res.render("customer/make_reservation.ejs", { message: req.flash('reservationMessage') });
    });


    //customer post routes
    app.post("/findRoom", isLoggedIn, customerRoutes.findRoom);

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
