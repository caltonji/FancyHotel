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
var exampleRooms1 = [{ Room_no : 211, Room_category : 'Suite', No_people : 4, Cost_day : 250, Cost_extra_bed_day : 150, location: "Atlanta"},
                        { Room_no : 103, Room_category : 'Standard', No_people : 2, Cost_day : 100, Cost_extra_bed_day : 70, location: "Atlanta"},
                         { Room_no : 222, Room_category : 'Standard', No_people : 6, Cost_day : 150, Cost_extra_bed_day : 50, location: "Atlanta"}];

var exampleRooms2 = [{ Room_no : 211, Room_category : 'Suite', No_people : 4, Cost_day : 250, Cost_extra_bed_day : 150, location: "Atlanta"},
                        { Room_no : 103, Room_category : 'Standard', No_people : 2, Cost_day : 100, Cost_extra_bed_day : 70, location: "Atlanta"}];

var exampleCards = [{Card_no : 12312341234, Name : "Personal"},
					{Card_no : 1142243212, Name : "Business"}]


exports.postFindRooms = function(req,res) {
	console.log("startdate: " + req.body.startDate + " end date " + req.body.endDate + " location " + req.body.location);
	req.session.reservation_startDate = req.body.startDate;
	req.session.reservation_endDate = req.body.endDate;
	req.session.reservation_location = req.body.location;
	res.redirect('/availablerooms');
}

// find the rooms by ids and put them in the flash, grab the cards too
exports.postAvailableRooms = function(req, res) {
	//FIXME do actual query
	console.log("entered");
	var items;
	if (!req.body.select_room) {
		//nothing selected
	} else if (!Array.isArray(req.body.select_room)) {
		//is one item
		items = [req.body.select_room];
	} else {
		// is multiple item
		items = req.body.select_room;
	}
	var itemsForQuery = [];
	for (var i in items) {
		itemsForQuery.push(getRoom(items[i]));
	}

	//FIXME: need to use actual query for this
	console.log(itemsForQuery);
	req.flash('rooms', exampleRooms2);
	res.redirect('/reservationdetails');
}

var getRoom = function(RoomnoLocation) {
	var arr = RoomnoLocation.split(" ");
	return {location : arr[1], Room_no : parseInt(arr[0])}
}

exports.postReservationDetails = function(req, res) {
	console.log("postReservationDetails");
	var startDate = req.session.reservation_startDate;
	var endDate = req.session.reservation_endDate;
	var location = req.session.reservation_location;
	//clear the session variables because we're done with it
	req.session.reservation_startDate = null;
	req.session.reservation_endDate = null;
	req.session.reservation_location = null;
	console.log("startdate: " + startDate + " end date " + endDate + " location " + location);
	var totalCost = parseInt(req.body.totalCost);
	var isCancelled = 0;
	var Card_no = req.body.payment_info;	
	res.redirect('/home');
}



