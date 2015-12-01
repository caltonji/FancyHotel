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
						Card_no	: 123412341234,
						Username : "caltonji"}];
var exampleReviews = [{ Comment : "You suck", Rating : "Very Bad", Location : "Atlanta"},
						{ Comment : "You're awesome", Rating : "Good", Location : "Atlanta"}];


exports.fillRoomsFromReservationId = function(req,res) {
	if (req.session.reservation_cancel_id) {
		req.flash('rooms', exampleRooms1);
	}
}

exports.fillRoomsFromSessionDates = function(req, res) {
	//set variables in first part the run sql query
	if (req.session.reservation_startDate) {
		console.log("startdate: " + req.session.reservation_startDate 
					+ " end date " +  req.session.reservation_endDate
					+ " location " + req.session.reservation_location);
	} else if (req.session.update_reservation_startDate) {
		// console.log("");
	} else return;
	req.flash('rooms', exampleRooms1);
}

exports.fillCardsFromUser = function(req, res) {
	var Username = req.user.Username;
	console.log({Username : Username});
	req.flash('cards', exampleCards);
}

exports.fillReservationFromSession = function(req, res) {
	if (req.session.reservation_update_id || req.session.reservation_cancel_id) {
		//FIXME: get the actual reservation
		req.flash('reservation', exampleReservation);
	}
}

exports.fillReviews = function(req, res) {
	if (req.query.location) {
    	req.flash('reviews', exampleReviews);        
    }
}






