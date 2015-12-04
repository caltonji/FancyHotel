var sqlCreator = require('../SqlStatementCreator');

var express = require('express');
var mysql = require('mysql');
var flash = require('connect-flash');
var session = require('express-session');
var moment = require('moment');

var connection = mysql.createConnection({
  host: "academic-mysql.cc.gatech.edu",
  user: "cs4400_Group_6",
  password: "tEVtJmV_",
  database : "cs4400_Group_6"
});
//just never let the connection
connection.connect();


var exampleRooms1 = [{ Room_no : 211, Room_category : 'Suite', No_people : 4, Cost_day : 250, Cost_extra_bed_day : 150, location: "Atlanta"},
                        { Room_no : 103, Room_category : 'Standard', No_people : 2, Cost_day : 100, Cost_extra_bed_day : 70, location: "Atlanta"},
                         { Room_no : 222, Room_category : 'Standard', No_people : 6, Cost_day : 150, Cost_extra_bed_day : 50, location: "Atlanta"}];

var exampleRooms2 = [{ Room_no : 211, Room_category : 'Suite', No_people : 4, Cost_day : 250, Cost_extra_bed_day : 150, location: "Atlanta"},
                        { Room_no : 103, Room_category : 'Standard', No_people : 2, Cost_day : 100, Cost_extra_bed_day : 70, location: "Atlanta"}];

var exampleCards = [{Card_no : 12312341234, Name : "Personal"},
                    {Card_no : 1142243212, Name : "Business"}]

var exampleReservation = [{ Reservation_ID : 1234,
                           Start_date : '2015-12-02',
                        End_date : '2015-12-07',
                        Total_cost : 1050.0,
                        Is_cancelled : 0,
                        Card_no : 123412341234,
                        Username : "caltonji"}];
var exampleReviews = [{ Comment : "You suck", Rating : "Very Bad", Location : "Atlanta"},
                        { Comment : "You're awesome", Rating : "Good", Location : "Atlanta"}];


exports.fillReviews = function(req, res, callback) {
    if (req.query.location) {
        var query = sqlCreator.findReviews(req.query.location);
        console.log(query);
        connection.query(query, function(err, rows) {
            if (err) {
                req.flash('failure_message', 'Problem connecting to DB');
                callback();
            }
            if (rows.length > 0) {
                req.flash('reviews', rows);
            }
            callback();
        });   
    } else {
        callback();
    }
}


exports.fillRoomsFromCancelReservationId = function(req,res, callback) {
    if (req.session.reservation_cancel_id) {
        getRooms(parseInt(req.session.reservation_cancel_id), function(rooms) {
                req.flash('rooms', rooms);
                callback();
        });
    }
}

exports.fillRoomsForAvailable = function(req, res, callback) {
    var startDate = req.session.reservation_startDate;
    var endDate =  req.session.reservation_endDate;
    var location = req.session.reservation_location;
    var query = sqlCreator.searchAvailableRooms(location, startDate, endDate);
    console.log(query);

    connection.query(query, function(err, rows) {
        console.log(rows);
        console.log('errors',err);
        if (err) {
            req.flash('failure_message', 'Problem connecting to DB');
            callback();
        } else {
            if (rows.length > 0) {
                req.flash('rooms', rows)
            }
            callback();
        }
    });
}
var getRooms = function(reservation_id, callback) {
    var data = {};
    var query = sqlCreator.searchRoomsByID(reservation_id);
    console.log(query);
    connection.query(query, function(err, rows) {
        //console.log(rows);
        console.log('errors', err);
        if (err) {
            //req.flash('failure_message', 'Problem connecting to DB');
            callback();
        } else {
            if (rows.length > 0) {
                //req.flash('reservation', rows);
                data = rows;
            }
            console.log(data);
            callback(data);
        }
    });
}

exports.fillRoomsFromSessionDates = function(req, res) {
    //set variables in first part the run sql query
    if (req.session.reservation_startDate) {
        var startDate = req.session.reservation_startDate;
        var endDate =  req.session.reservation_endDate;
        var location = req.session.reservation_location;
        var query = sqlCreator.searchAvailableRooms(location, startDate, endDate);
        console.log(query);

        connection.query(query, function(err, rows) {
            console.log(rows);
            console.log('errors',err);
            if (err) {
                req.flash('failure_message', 'Problem connecting to DB');
                callback();
            } else {
                if (rows.length > 0) {
                    req.flash('rooms', rows)
                }
                callback();
            }
        });
    } else {
        res.redirect('/findRoom')
    }
}

exports.fillRoomsForUpdate = function(req,res, callback) {
    console.log("in fill rooms")
    console.log(req);
    var New_start_date = new Date(req.session.update_reservation_startDate);
    var New_end_date = new Date(req.session.update_reservation_endDate);
    var Reservation_id = parseInt(req.session.reservation_update_id);
    var availableRooms = [];
    var errored = false;
    if (Reservation_id) {
        getRooms(Reservation_id, function(rooms) {
            // req.flash('rooms', rooms);
            // callback();
            console.log(rooms);
            var counter = 0;
            var queries = [];
            for (var key in rooms) {
                queries[key] = sqlCreator.searchAvailableUpdate(rooms[key].Location, rooms[key].Room_no, New_start_date, New_end_date, Reservation_id);
            }
            var roomCount = queries.length;
            for (var key in queries) {
                //var query = sqlCreator.searchAvailableUpdate(roomdata[i].Location, roomdata[i].Room_no, New_start_date, New_end_date);
                console.log(queries[key]);
                connection.query(queries[key], function(err, rows) {
                    console.log('errors', err);
                    if (err) {
                        console.log({error: err});
                        errored = true;
                    }  else {
                        console.log(rows);
                        if (rows.length == 0) {
                            console.log("one room not available during this time period");
                            errored = true;
                        } else {
                            availableRooms.push(rows[0]);
                        }
                    }
                    counter++;
                    if (counter == roomCount) {
                        if (errored) {
                            callback(false);
                        } else {
                            req.flash('rooms', availableRooms);
                            callback(true);
                        }
                    }
                });
            }
        });
    }
}


exports.fillCardsFromUser = function(req, res, callback) {
    var Username = req.user.Username;
    console.log({Username : Username});
    var data = {};
    var query = sqlCreator.findPaymentInformation(Username);
    console.log(query);
    connection.query(query, function(err, rows) {
        console.log(rows);
        console.log('errors',err);
        if (err) {
            req.flash('failure_message', 'Problem connecting to DB');
            callback();
        } else {
            if (rows.length > 0) {
                req.flash('cards', rows);
            }
            callback();
        }
    });
}

exports.fillReservationFromUpdate = function(req, res, callback) {
	getReservation(req, parseInt(req.session.reservation_update_id), req.user.Username, function(reservation) {
		if (reservation) {
            req.flash('reservation', reservation);
            callback(true);
        } else {
            // req.flash('message', "This reservation does not exist, or you are not authorized to view it.");
            callback(false);
        }
	});
}

exports.fillReservationFromCancel = function(req, res, callback) {
    getReservation(req, parseInt(req.session.reservation_cancel_id), req.user.Username, function(reservation) {
        if (reservation != null) {
            req.flash('reservation', reservation);
            callback(true);
        } else {
            // req.flash('message', "This reservation does not exist, or you are not authorized to view it.");
            callback(false);
        }
    });
}

var getReservation = function(req, reservation_id, username, callback) {
    var data = {};
    var query = sqlCreator.findReservation(parseInt(reservation_id), username);
    console.log(query);
    connection.query(query, function(err, rows) {
        //console.log(rows);
        console.log('errors', err);
        if (err) {
            //req.flash('failure_message', 'Problem connecting to DB');
            callback();
        } else {
            if (rows.length == 0) {
                req.flash('failure_message', "This reservation does not exist, or you are not authorized to view it.");
                callback(null);
            } else if (rows[0].Is_cancelled == 1) {
                req.flash('success_message', "This reservation has already been cancelled.");
                callback(null);
            } else {
                 //req.flash('reservation', rows);
                data = rows;
                data[0].Start_date = moment(data[0].Start_date).format('YYYY-MM-DD');
                data[0].End_date = moment(data[0].End_date).format('YYYY-MM-DD');
                console.log(data);
                callback(data);
            }
        }
    });
}
