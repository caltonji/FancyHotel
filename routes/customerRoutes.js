var express = require('express');
var mysql = require('mysql');
var flash = require('connect-flash');

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



exports.findRooms = function(req,res) {
	//FIXME: make actual query and return results
	console.log("startdate: " + req.body.startDate + " end date " + req.body.endDate + " location " + req.body.location);
	var rooms = exampleRooms1;
	req.flash('rooms', rooms);
	res.redirect('/availablerooms');
}

exports.findRoomsByIds = function(req, res) {
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
		var arr = items[i].split(" ");
		itemsForQuery.push({location : arr[1], Room_no : parseInt(arr[0])});
	}

	//FIXME: need to use actual query for this
	console.log(itemsForQuery);
	req.flash('rooms', exampleRooms2);
	res.redirect('/reservationdetails');
}





