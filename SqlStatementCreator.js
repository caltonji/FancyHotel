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
		+ "AND username = " + mysql.escape(username) + ";";
}

exports.createReservation = function(startDate, endDate, totalCost, isCancelled, cardNo, username) {
	return "INSERT INTO RESERVATION ( Start_date, End_date, Total_cost, Is_cancelled, Card_no, Username ) VALUES ("
		+ mysql.escape(startDate) + "," + mysql.escape(endDate) + "," + mysql.escape(totalCost) + "," + mysql.escape(isCancelled)
		+ "," + mysql.escape(cardNo) + "," + mysql.escape(username) + ");";
}

exports.cancelReservation = function(reservationID, username) {
	return "UPDATE RESERVATION SET Is_cancelled = " + mysql.escape(1) + " WHERE Reservation_Id = " + mysql.escape(reservationID)
			+ " AND username = " + mysql.escape(username) + ";";
}

exports.updateReservation
//deleting old has_room associated with reservation
//adding new has_room to reservation

exports.findReview = function(location) {
	return "SELECT Rating, Comment FROM HOTEL_REVIEW WHERE Location = " + mysql.escape(location) + ";";
}

exports.createReviewNoComment = function(rating, location, username) {
	return "INSERT INTO HOTEL_REVIEW ( Rating, Location, Username ) VALUES (" + mysql.escape(rating) + ","
		+ mysql.escape(location) + "," + mysql.escape(username) + ";";
}

exports.createReviewWithComment = function(comment, rating, location, username) {
	return "INSERT INTO HOTEL_REVIEW ( Comment, Rating, Location, Username ) VALUES (" + mysql.escape(comment)
		+ ","+ mysql.escape(rating) + "," + mysql.escape(location) + "," + mysql.escape(username) + ";";
}

exports.searchRooms = function(roomArray) { //TODO: test this?

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

exports.createReservationReport = function(month_number) { //This will need to be run once for each month
	return "SELECT location, COUNT( * ) AS location_count FROM RESERVATION NATURAL JOIN HAS_ROOM WHERE MONTH(Start_date) = "
		+ mysql.escape(month_number) + "AND Is_cancelled = " + mysql.escape(0) + " GROUP BY location";
} //Returns tuples in the form (location, location_count)

exports.createPopularRoomReport = function(month_number) { //This will need to be run once for each month
	return "SELECT location, Room_category, MAX(sub.counter)FROM (SELECT location, Room_category, COUNT( * ) AS counter"
		+ " FROM ROOM NATURAL JOIN RESERVATION NATURAL JOIN HAS_ROOM WHERE MONTH( Start_date ) =  " + mysql.escape(month_number)
		+ "AND Is_cancelled = " + mysql.escape(0) + " GROUP BY location, Room_category) AS sub GROUP BY location;";
} //Returns tuples in the form (location, Room_category, count)

exports.createRevenueReport = function(month_number) { //This will need to be run once for each month
	return "SELECT location, SUM(Total_cost) FROM ROOM NATURAL JOIN HAS_ROOM NATURAL JOIN RESERVATION WHERE MONTH(Start_date) = "
		+ mysql.escape(month_number) + "AND Is_cancelled = " + mysql.escape(0) + " GROUP BY location";
} //Returns tuples in the form (location, SUM(Total_cost))

