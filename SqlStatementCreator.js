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

exports.deleteReservation = function(reservationID, username) {
	return "DELETE FROM RESERVATION WHERE Reservation_ID = " + mysql.escape(reservationID)
		+ "AND username = " + mysql.escape(username) + ";";
}

exports.findReview = function(location) {
	return "SELECT Rating, Comment FROM HOTEL_REVIEW WHERE Location = " + mysql.escape(location) + ";";
}