var mysql = require('mysql');


exports.findCustomer = function(username) {
	return  "SELECT * FROM CUSTOMER " +
			"WHERE Username = " + mysql.escape(username) + ";";
}

exports.findManager = function(username) {
	return "SELECT * FROM MANAGEMENT " +
			"WHERE Username = " + mysql.escape(username) + ";";
}

exports.newCustomer = function(username, password, email) {
	return  "INSERT INTO CUSTOMER ( Username, Password, Email ) VALUES (" + mysql.escape(username) + "," + mysql.escape(password)
		+ "," + mysql.escape(email) + ");";
}

exports.addPaymentInformation = function(name, expDate, cvv, cardNo, username) {
	return "INSERT INTO PAYMENT_INFORMATION ( Name, Exp_date, CVV, Card_no, Username ) VALUES (" + mysql.escape(name) + ","
		+ mysql.escape(expDate) + "," + mysql.escape(cvv) + "," + mysql.escape(cardNo) + "," + mysql.escape(username) + ");";
}

exports.findPaymentInformation = function(username) {
	return "SELECT * FROM PAYMENT_INFORMATION WHERE Username = " + mysql.escape(username) + ";";
}

exports.deletePaymentInformation = function(username, cardNo) {
	return "DELETE FROM PAYMENT_INFORMATION WHERE Username = " + mysql.escape(username)
		+ " AND Card_no = " + mysql.escape(cardNo) + ";";
}

exports.findReservation = function(reservationID, username) {
	return "SELECT * FROM RESERVATION WHERE Reservation_ID = " + mysql.escape(reservationID)
		+ " AND username = " + mysql.escape(username) + ";";
}

exports.createReservation = function(startDate, endDate, totalCost, isCancelled, cardNo, username, roomArray) { //roomArray = location, room_No, Extra_bed
	var query =  "INSERT INTO RESERVATION ( Start_date, End_date, Total_cost, Is_cancelled, Card_no, Username ) VALUES ("
		+ mysql.escape(startDate) + "," + mysql.escape(endDate) + "," + mysql.escape(totalCost) + "," + mysql.escape(isCancelled)
		+ "," + mysql.escape(cardNo) + "," + mysql.escape(username) + ");";

	query = query + "INSERT INTO HAS_ROOM (Reservation_ID, Extra_bed, Room_no, location) VALUES (@@IDENTITY, ";

	for (var i = 0; i < roomArray.length; i++) {

		var room = roomArray[i];

		query = query + mysql.escape(room.Extra_bed) + ", " + mysql.escape(room.Room_no) + ", " + mysql.escape(room.location)+ "); ";

		if (i != roomArray.length - 1) {
			query = query + " INSERT INTO HAS_ROOM (Reservation_ID, Extra_bed, Room_no, location) VALUES (@@IDENTITY, ";
		}
	}

	return query;
}

exports.cancelReservation = function(reservationID, username) {
	return "UPDATE RESERVATION SET Is_cancelled = " + mysql.escape(1) + ", Cancel_date = " + CURDATE()
			+ " WHERE Reservation_Id = " + mysql.escape(reservationID) + " AND username = " + mysql.escape(username) + ";";
}

exports.updateReservation = function(reservationID, username, new_Start_date, new_End_date) {
	return "UPDATE RESERVATION SET  Start_date =  " + mysql.escape(new_Start_date) + ", End_date =  "
		+ mysql.escape(new_End_date) + " WHERE  Reservation_ID = " + mysql.escape(reservationID) + " AND username = "
		+ mysql.escape(username) + ";";
}

exports.findReviews = function(location) {
	return "SELECT Rating, Comment FROM HOTEL_REVIEW WHERE Location = " + mysql.escape(location) + ";";
}

exports.createReviewNoComment = function(rating, location, username) {
	return "INSERT INTO HOTEL_REVIEW ( Rating, Location, Username ) VALUES (" + mysql.escape(rating) + ","
		+ mysql.escape(location) + "," + mysql.escape(username) + ");";
}

exports.createReviewWithComment = function(comment, rating, location, username) {
	return "INSERT INTO HOTEL_REVIEW ( Comment, Rating, Location, Username ) VALUES (" + mysql.escape(comment)
		+ ","+ mysql.escape(rating) + "," + mysql.escape(location) + "," + mysql.escape(username) + ");";
}

exports.searchRooms = function(roomArray) {

	var query = "SELECT * FROM ROOM WHERE (";

	for (var i = 0; i < roomArray.length; i++) {

		var room = roomArray[i];

		query = query + " location = " + mysql.escape(room.location) + " AND Room_no = " + mysql.escape(room.Room_no) + ")";

		if (i != roomArray.length - 1) {
			query = query + " OR (";
		} else {
			query = query + ";";
		}
	}

	return query;
}

exports.searchAvailableRooms = function(location, start_date, end_date) {
	return "SELECT * FROM ROOM WHERE LOCATION = " + mysql.escape(location) +" AND NOT EXISTS (SELECT Room_no FROM "
		+ "HAS_ROOM NATURAL JOIN RESERVATION WHERE ROOM.Room_no = HAS_ROOM.Room_no AND ROOM.location = HAS_ROOM.location "
		+ "AND RESERVATION.Is_cancelled = " + mysql.escape(0) + " AND (( " + mysql.escape(start_date) + " <= End_date AND "
		+ mysql.escape(end_date) + " >= End_date)));";
}

exports.searchAvailableUpdate = function(location, room_no, start_date, end_date) {
	return "SELECT * FROM ROOM NATURAL JOIN HAS_ROOM WHERE ROOM_NO =" + mysql.escape(room_no) + " AND LOCATION = "
			+ mysql.escape(location) +" AND NOT EXISTS (SELECT Room_no, Extra_bed FROM HAS_ROOM NATURAL JOIN RESERVATION"
	 		+ " WHERE ROOM.Room_no = HAS_ROOM.Room_no AND ROOM.location = HAS_ROOM.location AND RESERVATION.Is_cancelled"
			+ "= " + mysql.escape(0) + " AND (( " + mysql.escape(start_date) + " <= End_date AND " + mysql.escape(end_date) + " >= End_date)));";
}

exports.searchRoomsByID = function(reservationID) {
	return "SELECT Room_no, Location, No_people, Cost_of_extra_bed_per_day, Room_category, Cost_day, Extra_bed FROM "
		+ " ROOM NATURAL JOIN HAS_ROOM WHERE Reservation_Id = " + mysql.escape(reservationID) + ";";
}

exports.createReservationReport = function(month_number) { //This will need to be run once for each month
	return "SELECT location, COUNT( * ) AS location_count FROM RESERVATION NATURAL JOIN HAS_ROOM WHERE MONTH(Start_date) = "
		+ mysql.escape(month_number) + " AND Is_cancelled = " + mysql.escape(0) + " GROUP BY location";
} //Returns tuples in the form (location, location_count)

exports.createPopularRoomReport = function(month_number) { //This will need to be run once for each month
	return "SELECT location, Room_category, MAX(sub.counter) AS total_rooms FROM (SELECT location, Room_category, COUNT( * ) AS counter"
		+ " FROM ROOM NATURAL JOIN RESERVATION NATURAL JOIN HAS_ROOM WHERE MONTH( Start_date ) =  " + mysql.escape(month_number)
		+ " AND Is_cancelled = " + mysql.escape(0) + " GROUP BY location, Room_category) AS sub GROUP BY location;";
} //Returns tuples in the form (location, Room_category, count)

exports.createMonthlyReport = function(month_number, city) { //This will need to be run once for each month and city
	return "SELECT " + mysql.escape(month_number) + "AS Month, " + mysql.escape(city) + " AS City, IFNULL(NOREFUND.cost," + mysql.escape(0) + ") + IFNULL(PARTIAL.cost, " + mysql.escape(0) + ") + IFNULL(BASE.cost," + mysql.escape(0) + ") AS Revenue "
		+ " FROM (SELECT SUM( Total_cost ) AS cost "
			+ " FROM ROOM NATURAL JOIN RESERVATION NATURAL JOIN HAS_ROOM WHERE MONTH( Start_date ) =  " + mysql.escape(month_number) + " AND Is_cancelled = " + mysql.escape(0)
			+ " AND Location =" + mysql.escape(city) + ")AS BASE, "
		+" (SELECT SUM( Total_cost ) *" + mysql.escape(.2) +" AS cost "
			+" FROM ROOM NATURAL JOIN RESERVATION NATURAL JOIN HAS_ROOM WHERE MONTH( Start_date ) =  " + mysql.escape(month_number) + " AND Is_cancelled = " + mysql.escape(1)
			+" AND DATEDIFF( Start_date, Cancel_date ) =" + mysql.escape(2) + " OR " + mysql.escape(3) +" AND Location =" + mysql.escape(city) + ") AS PARTIAL, "
		+" (SELECT SUM( Total_cost ) AS cost "
			+" FROM ROOM NATURAL JOIN RESERVATION NATURAL JOIN HAS_ROOM WHERE MONTH( Start_date ) =  " + mysql.escape(month_number) + " AND Is_cancelled = " + mysql.escape(1)
			+" AND DATEDIFF( Start_date, Cancel_date ) < " + mysql.escape(2) + " AND Location =" + mysql.escape(city) + ") AS NOREFUND"
} //Returns single tuple in the form (city, revenue)
