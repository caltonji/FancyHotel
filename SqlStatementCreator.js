var mysql = require('mysql');


exports.findCustomer = function(username) {
	return  "SELECT * FROM CUSTOMER " +
			"WHERE Username = " + mysql.escape(username) + ";";
}

exports.newCustomer = function(username, password, email) {
	return  "INSERT INTO CUSTOMER ( Username, Password, Email ) VALUES (" + mysql.escape(username) + "," + mysql.escape(password) + "," + mysql.escape(email) + ");"
}
