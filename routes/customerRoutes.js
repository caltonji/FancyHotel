var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "academic-mysql.cc.gatech.edu",
  user: "cs4400_Group_6",
  password: "tEVtJmV_",
  database : "cs4400_Group_6"
});

exports.findRoom = function(req,res) {
	connection.connect(function(err) {
		if (err) {
			req.flash('reservationMessage', 'Problem connecting to DB. Are you on GT wifi/a VPN?');
			res.redirect('/newReservation');
		}
	});
	connection.end();
	console.log(connection);
	console.log("the prev line will not be blank if connection lives everywhere");
}
