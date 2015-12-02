var mysql = require('mysql');

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

var sqlCreator = require('../SqlStatementCreator');


// First you need to create a connection to the db
var connection = mysql.createConnection({
  host: "academic-mysql.cc.gatech.edu",
  user: "cs4400_Group_6",
  password: "tEVtJmV_",
  database : "cs4400_Group_6"
});


connection.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    console.log(err);
    return;
  }
  console.log('Connection established');
});

// connection.end(function(err) {
// 	console.log("connection terminated");
// 	// The connection is terminated gracefully
// 	// Ensures all previously enqueued queries are still
// 	// before sending a COM_QUIT packet to the MySQL server.
// });

module.exports = function(passport) {
	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.Username);
    });

    // used to deserialize the user
    passport.deserializeUser(function(username, done) {
        connection.query(sqlCreator.findCustomer(username),function(err,rows){	
            if (rows.length == 0) {
                connection.query(sqlCreator.findManager(username),function(err2,rows2){  
                    done(err, rows2[0]);
                });
            } else {
                done(err, rows[0]);
            }
		});
    });



    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-customer-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password1',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
    	console.log('new sign in request');
    	console.log(req.body);

    	if (req.body.password1 != req.body.password2) {
    		return done(null, false, req.flash('signupMessage', 'Your passwords need to match.'));
    	}

        
        //if emails need to be unique as well then this query needs to end with  OR Email = " + req.body.email + "';"
        connection.query(sqlCreator.findCustomer(username), function(err,rows) {
			console.log(rows);
			console.log("above row object");
			if (err)
		        return done(err);
			if (rows.length) {
		        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
		    } else {
		    	var newUserMysql = new Object();
				
				newUserMysql.Username = username;
                newUserMysql.Password = password; // use the generateHash function in our user model
			
				var insertQuery = sqlCreator.newCustomer(username, password,req.body.email);
				connection.query(insertQuery, function(err,rows){
					if (err) throw err;
					return done(null, newUserMysql);
				});
			}
        });
    }));

	passport.use('local-customer-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
    	console.log('new sign in request');
    	console.log(req.body);
        
        //if emails need to be unique as well then this query needs to end with  OR Email = " + req.body.email + "';"
        console.log("checking sql creator");
        console.log(sqlCreator.findCustomer(username));
        connection.query(sqlCreator.findCustomer(username), function(err,rows) {
			console.log(rows);
			console.log("above row object");
			if (err)
		        return done(err);
			if (!rows.length) {
		        return done(null, false, req.flash('loginMessage', "Username not found"));
		    } else {
		    	// if the user is found but the password is wrong
            	if (rows[0].Password != password)
                	return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
			
	            // all is well, return successful user
	            return done(null, rows[0]);		
			}
        });
    }));

    passport.use('local-management-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
        console.log('new sign in request');
        console.log(req.body);
        
        //if emails need to be unique as well then this query needs to end with  OR Email = " + req.body.email + "';"
        console.log("checking sql creator");
        console.log(sqlCreator.findManager(username));
        connection.query(sqlCreator.findManager(username), function(err,rows) {
            console.log(rows);
            console.log("above row object");
            if (err)
                return done(err);
            if (!rows.length) {
                return done(null, false, req.flash('loginMessage', "Username not found"));
            } else {
                // if the user is found but the password is wrong
                if (rows[0].Password != password)
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            
                // all is well, return successful user
                return done(null, rows[0]);     
            }
        });
    }));
};





