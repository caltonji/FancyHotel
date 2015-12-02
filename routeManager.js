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

    app.get("/findRoom", isLoggedIn, function(req,res) {
        res.render("customer/find_room.ejs", { message: req.flash('reservationMessage') });
    });

    app.get("/availablerooms", isLoggedIn, function(req,res) {
        flashFills.fillRoomsForAvailable(req, res, function() {
            res.render("customer/make_reservation.ejs", {rooms : req.flash('rooms'),  message: req.flash('message'), session : req.session});
        });
    });

    app.get("/reservationdetails", isLoggedIn, function(req,res) {
        flashFills.fillCardsFromUser(req, res, function() {
            res.render("customer/reservation_details.ejs", {cards : req.flash('cards'), rooms : req.flash('rooms'), message: req.flash('reservationMessage'), session : req.session });
        });
    });

    app.get("/updatereservation1", isLoggedIn, function(req,res) {
        res.render("customer/update_reservation1.ejs", { message: req.flash('reservationMessage') });
    });

    app.get("/paymentinfo", isLoggedIn, function(req,res) {
        flashFills.fillCardsFromUser(req, res, function() {
            res.render("customer/payment_info.ejs", { cards : req.flash('cards'), success_message: req.flash('success_message'), failure_message : req.flash('failure_message') });
        });
    });

    app.get("/updatereservation1", isLoggedIn, function(req,res) {
        res.render("customer/update_reservation1.ejs", { message: req.flash('reservationMessage') } );
    });

    app.get("/updatereservation2/:reservation_id", isLoggedIn, function(req,res) {
        req.session.reservation_update_id = req.params.reservation_id;
        flashFills.fillReservationFromUpdate(req, res, function() {
            res.render("customer/update_reservation2.ejs", { reservation : req.flash('reservation'), message: req.flash('reservationMessage') });
        });
    });

    app.get("/updatereservation2", isLoggedIn, function(req,res) {
        res.redirect("/updatereservation1");
    });

    app.get("/updatereservation3/:reservation_id", isLoggedIn, function(req,res) {
        req.session.reservation_update_id = req.params.reservation_id;
        flashFills.fillRoomsForUpdate(req, res);
        flashFills.fillReservationFromUpdate(req, res, function() {
            res.render("customer/update_reservation3.ejs", { rooms : req.flash('rooms'), reservation : req.flash('reservation'), message: req.flash('reservationMessage'), session : req.session });
        });
    });

    app.get("/updatereservation3", isLoggedIn, function(req,res) {
        res.redirect("/updatereservation1");
    });

    app.get("/lookupreservation", isLoggedIn, function(req, res) {
        res.render("customer/lookup_reservation");
    })

    app.get("/cancelreservation/:cancel_id", isLoggedIn, function(req,res) {
        req.session.reservation_cancel_id = req.params.cancel_id;
        flashFills.fillRoomsFromCancelReservationId(req, res, function() {
            flashFills.fillReservationFromCancel(req, res, function() {
                res.render("customer/cancel_reservation.ejs", { reservation : req.flash('reservation'), rooms : req.flash('rooms'), message: req.flash('reservationMessage'), session : req.session });
            });
        });
    });

    app.get("/cancelreservation", isLoggedIn, function(req,res) {
        res.redirect('/lookupreservation');
    });

    app.get("/viewreview", isLoggedIn, function(req,res) {
        flashFills.fillReviews(req,res, function() {
            res.render("customer/view_review.ejs", { location : req.query.location, reviews : req.flash('reviews'), failure_message: req.flash('failure_message') });
        });
    });

    app.get("/givereview", isLoggedIn, function(req,res) {
        res.render("customer/give_review.ejs", { failure_message: req.flash('failure_message') });
    });

    //manager get routes
    app.get('/managerhome', isLoggedIn, function(req, res) {
        res.render("manager/manager_home.ejs", {username : req.user.Username});
    });

    app.get("/reservationreport", isLoggedIn, function(req,res) {
        managerFlashFills.fillReservationreport(req,res,function(){
            res.render("manager/reservation_report.ejs", { reservationreports : req.flash('reservationreports'),message: req.flash('message') });
        });
    });

    app.get("/poproomreport", isLoggedIn, function(req,res) {
        managerFlashFills.fillPopularRoomReport(req,res, function() {
            res.render("manager/popularRoom_report.ejs", { roomcatreports : req.flash('roomcatreports'), message: req.flash('reservationMessage') });
        });
    });

    app.get("/revenuereport", isLoggedIn, function(req,res) {
        managerFlashFills.fillRevenueReport(req,res, function() {
            res.render("manager/revenue_report.ejs", { revenuereports: req.flash('revenuereports'), message: req.flash('message') });
        });
    });





    //customer post routes
    app.post("/findRoom", isLoggedIn, customerRoutes.postFindRooms);

    app.post("/availablerooms", isLoggedIn, customerRoutes.postAvailableRooms);

    app.post("/reservationdetails", isLoggedIn, customerRoutes.postReservationDetails);

    app.post("/updatereservation1", isLoggedIn, customerRoutes.postUpdatereservation1);

    app.post("/updatereservation2/:reservation_id", isLoggedIn, customerRoutes.postUpdatereservation2);

    app.post("/updatereservation3/:reservation_id", isLoggedIn, customerRoutes.postUpdatereservation3);

    app.post("/lookupreservation", isLoggedIn, customerRoutes.postLookupreservation);

    app.post("/cancelreservation/:cancel_id", isLoggedIn, customerRoutes.postCancelreservation);


    // app.post("/cancelreservation", function(req, res) {
    //     res.redirect("/cancelreservation");
    // })

    app.post("/givereview", isLoggedIn, customerRoutes.postGivereview);

    app.post("/addPaymentInfo", isLoggedIn, customerRoutes.postAddPaymentInfo);

    app.post("/deletePaymentInfo", isLoggedIn, customerRoutes.postDeletePaymentInfo);

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
