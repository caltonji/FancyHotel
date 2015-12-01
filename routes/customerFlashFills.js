var exampleRooms1 = [{ Room_no : 211, Room_category : 'Suite', No_people : 4, Cost_day : 250, Cost_extra_bed_day : 150, location: "Atlanta"},
                        { Room_no : 103, Room_category : 'Standard', No_people : 2, Cost_day : 100, Cost_extra_bed_day : 70, location: "Atlanta"},
                         { Room_no : 222, Room_category : 'Standard', No_people : 6, Cost_day : 150, Cost_extra_bed_day : 50, location: "Atlanta"}];

var exampleRooms2 = [{ Room_no : 211, Room_category : 'Suite', No_people : 4, Cost_day : 250, Cost_extra_bed_day : 150, location: "Atlanta"},
                        { Room_no : 103, Room_category : 'Standard', No_people : 2, Cost_day : 100, Cost_extra_bed_day : 70, location: "Atlanta"}];

var exampleCards = [{Card_no : 12312341234, Name : "Personal"},
					{Card_no : 1142243212, Name : "Business"}]


exports.fillRoomsFromSession = function(req, res) {
	if (req.session.reservation_startDate) {
		console.log("startdate: " + req.session.reservation_startDate 
					+ " end date " +  req.session.reservation_endDate
					+ " location " + req.session.reservation_location);
		req.flash('rooms', exampleRooms1);
	}
}

exports.fillCardsFromUser = function(req, res) {
	req.flash('cards', exampleCards);
}