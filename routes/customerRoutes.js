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
var example = [{ Room_no : 211, Room_category : 'Suite', No_people : 4, Cost_day : 250, Cost_extra_bed_day : 150, location: "Atlanta"},
                        { Room_no : 103, Room_category : 'Standard', No_people : 2, Cost_day : 100, Cost_extra_bed_day : 70, location: "Atlanta"}];


exports.findRooms = function(req,res) {
	//FIXME: make actual query and return results
	console.log("startdate: " + req.body.startDate + " end date " + req.body.endDate + " location " + req.body.location);
	var rooms = example;
	req.flash('rooms', rooms);
	res.redirect('/availablerooms');
}
