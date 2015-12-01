/**
 * Created by AltonjiC on 9/26/15.
 */
var express = require('express');
var path = __dirname + '/views/';

var customerRoutes = require('./routes/customerRoutes');
var flashFills = require('./routes/customerFlashFills');
var managerFlashFills = require('./routes/managerFlashFills');
var managerRoutes= require('./routes/managerRoutes');

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

    app.get("/managerlogin", function(req,res) {
        res.render("management_login.ejs", { message: req.flash('loginMessage') });
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

    app.post("/managerlogin", passport.authenticate('local-management-login', {
        successRedirect : '/managerhome', // redirect to the secure profile section
        failureRedirect : '/managerlogin', // redirect back to the login page if there is an error
        failureFlash : true // allow flash messages
    }));


    app.post('/register', passport.authenticate('local-customer-signup', {
        successRedirect : '/home', // redirect to the secure profile section
        failureRedirect : '/register', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    //customer get routes
    app.get("/home", isLoggedIn, function(req,res) {
        res.render("customer/customer_home.ejs", { success_message : req.flash('success_message'), username: req.user.Username});
    });

    app.get("/findRoom", function(req,res) {
        res.render("customer/find_room.ejs", { message: req.flash('reservationMessage') });
    });

    app.get("/availablerooms", function(req,res) {
        flashFills.fillRoomsFromSessionDates(req, res);
        res.render("customer/make_reservation.ejs", {rooms : req.flash('rooms'),  message: req.flash('reservationMessage'), session : req.session});
    });

    app.get("/reservationdetails", function(req,res) {
        flashFills.fillCardsFromUser(req, res);
        res.render("customer/reservation_details.ejs", {cards : req.flash('cards'), rooms : req.flash('rooms'), message: req.flash('reservationMessage'), session : req.session });
    });

    app.get("/updatereservation1", function(req,res) {
        res.render("customer/update_reservation1.ejs", { message: req.flash('reservationMessage') });
    });

    app.get("/paymentinfo", function(req,res) {
        flashFills.fillCardsFromUser(req, res);
        res.render("customer/payment_info.ejs", { cards : req.flash('cards'), success_message: req.flash('success_message'), failure_message : req.flash('failure_message') });
    });

    app.get("/updatereservation1", function(req,res) {
        res.render("customer/update_reservation1.ejs", { message: req.flash('reservationMessage') });
    });

    app.get("/updatereservation2/:reservation_id", function(req,res) {
        req.session.reservation_update_id = req.params.reservation_id;
        flashFills.fillReservationFromSession(req, res);
        res.render("customer/update_reservation2.ejs", { reservation : req.flash('reservation'), message: req.flash('reservationMessage') });
    });

    app.get("/updatereservation2", function(req,res) {
        res.redirect("/updatereservation1");
    });

    app.get("/updatereservation3/:reservation_id", function(req,res) {
        req.session.reservation_update_id = req.params.reservation_id;
        flashFills.fillRoomsFromSessionDates(req, res);
        flashFills.fillReservationFromSession(req, res);
        res.render("customer/update_reservation3.ejs", { rooms : req.flash('rooms'), reservation : req.flash('reservation'), message: req.flash('reservationMessage'), session : req.session });
    });

    app.get("/updatereservation3", function(req,res) {
        res.redirect("/updatereservation1");
    });

    app.get("/lookupreservation", function(req, res) {
        res.render("customer/lookup_reservation");
    })

    app.get("/cancelreservation/:cancel_id", function(req,res) {
        req.session.reservation_cancel_id = req.params.cancel_id;
        flashFills.fillRoomsFromReservationId(req, res);
        flashFills.fillReservationFromSession(req, res);
        res.render("customer/cancel_reservation.ejs", { reservation : req.flash('reservation'), rooms : req.flash('rooms'), message: req.flash('reservationMessage'), session : req.session });
    });

    app.get("/cancelreservation", function(req,res) {
        res.redirect('/lookupreservation');
    });

    app.get("/viewreview", function(req,res) {
        flashFills.fillReviews(req,res);
        res.render("customer/view_review.ejs", { location : req.query.location, reviews : req.flash('reviews'), message: req.flash('reservationMessage') });
    });

    app.get("/givereview", function(req,res) {
        res.render("customer/give_review.ejs", { message: req.flash('reservationMessage') });
    });

    //manager get routes
    app.get('/managerhome', isLoggedIn, function(req, res) {
        res.render("manager/manager_home.ejs", {username : req.user.Username});
    });

    app.get("/reservationreport", function(req,res) {
				managerFlashFills.fillReservationreport(req,res);
        res.render("manager/reservation_report.ejs", { reservationreports : req.flash('reservationreports'),message: req.flash('reservationMessage') });
    });

    app.get("/poproomreport", function(req,res) {
				managerFlashFills.fillPopularRoomReport(req,res);
        res.render("manager/popularRoom_report.ejs", { roomcatreports : req.flash('roomcatreports'), message: req.flash('reservationMessage') });
    });

    app.get("/revenuereport", function(req,res) {
				managerFlashFills.fillRevenueReport(req,res);
        res.render("manager/revenue_report.ejs", { revenuereports: req.flash('revenuereports'), message: req.flash('reservationMessage') });
    });


    //customer post routes
    app.post("/findRoom", customerRoutes.postFindRooms);

    app.post("/availablerooms", customerRoutes.postAvailableRooms);

    app.post("/reservationdetails", customerRoutes.postReservationDetails);

    app.post("/updatereservation1", customerRoutes.postUpdatereservation1);

    app.post("/updatereservation2/:reservation_id", customerRoutes.postUpdatereservation2);

    app.post("/updatereservation3/:reservation_id", customerRoutes.postUpdatereservation3);

    app.post("/lookupreservation", customerRoutes.postLookupreservation);
    
    app.post("/cancelreservation/:cancel_id", customerRoutes.postCancelreservation);

    // app.post("/cancelreservation", function(req, res) {
    //     res.redirect("/cancelreservation");
    // })

    app.post("/givereview", customerRoutes.postGivereview);

    app.post("/addPaymentInfo", customerRoutes.postAddPaymentInfo);

    app.post("/deletePaymentInfo", customerRoutes.postDeletePaymentInfo);

    app.post("/");

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
