const EYE_CATCHER = "***********************************************************";
const fs = require("fs");

const express = require('express');
const app = express();

const mysql   = require('mysql');
const pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'root',
	password: 'wang971001', // For mysql 8.0, need to configure the server to use "mysql native password" because mysql 8.0 uses a
							// new hash algorithm which this driver currently doesn't support. 
							// e.g. ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'wang971001'; flush privileges;
	database: 'CSCC09'
});  // TODO: Change user and password on deployment

/* ---- Authentication ---- */
const session = require('express-session');
app.use(session({
    secret: "1234@bnmv!", // TODO: Change this on deployment
    resave: false,
    saveUninitialized: true,
}));

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, JSON.stringify(user));
});

passport.deserializeUser(function(user, done) {
  done(null, JSON.parse(user));
});

let isAuthenticated = function(req, res, next) {
    if (!req.isAuthenticated()) return res.status(401).end("access denied"); 
    else next();
};

/*
 * Twitter authentication
 */

/*
const TwitterStrategy = require('passport-twitter').Strategy;

let TwitterCredentials = JSON.parse(fs.readFileSync('twitter.json.nogit', 'utf8'));

passport.use(new TwitterStrategy(TwitterCredentials, function(token, tokenSecret, profile, callback) {
     console.log(profile);
     callback(null, profile);
}));

// signin
app.get('/auth/twitter/', passport.authenticate('twitter'));

// signin callback
app.get('/auth/twitter/callback', passport.authenticate('twitter'), function(req, res, next){
    return res.end("user " + req.user.username + " has been signed in");
});
*/

/*
 * Facebook authentication
 */
const FacebookStrategy = require('passport-facebook').Strategy;

let FacebookCredentials = JSON.parse(fs.readFileSync('facebook.json.nogit', 'utf8'));

passport.use(new FacebookStrategy(FacebookCredentials, function(accessToken, refreshToken, profile, callback) {
     console.log("(Facebook Authentication) user profile:");
     console.log(profile);
     callback(null, profile);
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, JSON.stringify(user));
});

passport.deserializeUser(function(user, done) {
  done(null, JSON.parse(user));
});
                                     
// signin
app.get('/auth/facebook/', passport.authenticate('facebook'));

// signin callback
app.get('/auth/facebook/callback', passport.authenticate('facebook'), function(req, res, next){
    return res.end("(Facebook Authentication) user " + req.user.username + " has been signed in");
});

// curl -b cookie.txt http://localhost:3000/private/
// Test authentication
app.get('/private/', isAuthenticated, function (req, res, next) {
     return res.end("This is private");
});

/* ---- Authentication Done ---- */

/*
 * Request LOG
 */
app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

/* ---- Event APIs ---- */
const logAPIerror = function(API_route){
	console.log(EYE_CATCHER);
	console.log("Error in " + API_route + ":");
	console.log(error);
	console.log(EYE_CATCHER);
};

/*
 * Create an event and its timetable slots.
 */
app.post('/event/create', function(req, res, next){
	let event_detail = req.body.detail;
	let timetable_slots = req.body.timetable_slots; // Does not contain an event id

	let num_slots = timetable_slots.length;
	let num_finished = 0;
	pool.query("insert into event_detail values (?,?,?,?)", [null].concat(event_detail), function (error, results, fields){
		if (error) {
			logAPIerror("/event/create");
			res.status(500).end(err);
		}
		else {
			// Create the timetable slots
			for (let i = 0; i < num_slots; i++) {
				pool.query("insert into timetable_event values(?,?,?,?,?,?,?,?,?,?)", [null, results[0].id].concat(timetable_slots[i]), function (error2, results2, fields2) {
					if (error2) {
						logAPIerror("/event/create");
						res.status(500).end(err);
					}
					else {
						num_finished += 1;
						if (num_finished == num_slots) {
							res.json("Event created!");
						}
					}
				});
			}
		}
	});
	next(); // Correct?
});

/*
 * Add a timetable slot for an event.
 * If any slot is obscured by this slot, update the database accordingly.
 */
 app.post('/event/timetable_slot/create', function (req, res, next){
 	let timetable_slot = req.body.timetable_slot; // Does contain an event id
 	let obscure_id = req.body.obscure; // Slot id

 	pool.query("insert into timetable_event values(?,?,?,?,?,?,?,?,?,?)", timetable_slot, function (error, results, fields){
 		if (error) {
 			logAPIerror("/event/timetable_slot/create");
 			res.status(500).end(err);
 		}
 		else {
 			// Update the slot that is obscured
 			if (obscure_id !== null) {
 				pool.query("update timetable_event set obscured_by=? where id=?", [results[0].id, obscure_id], function(error2, results2, fields2){
 					if (error2) {
 						logAPIerror("/event/timetable_slot/create");
 						res.status(500).end(err);
 					}
 					else {
 						res.json("Timetable slot created!");
 					}
 				});
 			}
 		}
 	});
 	next(); // Correct?
 });

/*
 * Update an event.
 */
app.patch('/event/update', function (req, res, next){
	let event_detail = req.body.detail;
	let event_id = req.body.id;

	pool.query("update event_detail set text_content=?, media_content_urls=?, place=? where id=?", event_detail.concat(event_id), function (error, results, fields){
		if (error) {
			logAPIerror("/event/update");
			res.status(500).end(error);
		}
		else {
			res.json("Event updated!");
		}
	});
	next(); // Correct?
});

/*
 * Update a timetable slot
 */
app.patch('/event/timetable_slot/update', function (req, res, next){
	let timetable_slot = req.body.timetable_slot;
	let slot_id = req.body.id;

	pool.query("update timetable_event set start_time=?, length=?, day_of_the_week=? where id=?", timetable_slot.concat(event_id), function (error, results, fields){
		if (error) {
			logAPIerror("/event/timetable_slot/update");
			res.status(500).end(error);
		}
		else {
			res.json("Timetable slot updated!");
		}
	});
	next(); // Correct?
});

/*
 * Delete a timetable slot.
 * If this is actually a slot which obscures another slot, do not delete it but set all fields to null.
 */
app.delete('/event/timetable_slot/delete', function (req, res, next){
	let slot_id = req.body.id;

	pool.query("select id from timetable_event where obscured_by=?", [slot_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/timetable_slot/delete");
			res.status(500).end(error);
		}
		else {
			if (results[0].length !== 0) {
				// Set all fields to null
				pool.query("update timetable_event set is_empty_obscure where id=?", [slot_id], function (error2, results2, fields2){
					if (error2) {
						logAPIerror("/event/timetable_slot/delete");
						res.status(500).end(error2);
					}
					else {
						res.json("Timetable slot deleted!");
					}
				});
			}
			else {
				// Delete this slot
				pool.query("delete from timetable_event where id=?", [slot_id], function (error, results2, fields2){
					if (error2) {
						logAPIerror("/event/timetable_slot/delete");
						res.status(500).end(error2);
					}
					else {
						res.json("Timetable slot deleted!");
					}
				});
			}
		}
	});
	next(); // Correct?
});

/*
 * Delete an event and its timetable slots.
 */
app.delete("/event/delete", function (req, res, next){
	let event_id = req.body.id;

	pool.query("delete from event_detail where id=?", [event_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/delete");
			res.status(500).end(error);
		}
		else {
			// Delete the timetable slots
			pool.query("delete from timetable_event where event_id=?", [event_id], function (error2 ,results2, fields2){
				if (error2) {
					logAPIerror("/event/delete");
					res.status(500).end(error2);
				}
				else {
					res.json("Event deleted!");
				}
			});
		}
	});
	next(); // Correct?
});

// TODO: Retrieve all events for a given week.

/* ---- Event APIs done ---- */

/*
 * DEBUG
 */
app.get('/debug', function (req, res, next){
	/*pool.query('select ?', ["test query with placeholder"], function (error, results, fields){
		// results hold the result -- array of RowDataPacket; e.g. results[0].id, results[0].author
		// fields hold the result set metadata
		if (error) throw error;
		res.json(results);
	});*/
	/*pool.query('select * from event', function (error, results, fields){
		if (error) throw error;
		res.json(results);
	});*/
	let data = [null, "test_event1", "test_user1", "test_content1", "", "some place", false, false];
	pool.query('insert into event values (?,?,?,?,?,?,?,?)', data, function (error, results, fields){
		if (error) throw error;
		res.json(results); // {"fieldCount":0,"affectedRows":1,"insertId":2,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}
	});
	next();
});

// TODO: How to insert NULL?


/*
 * Response LOG
 */
app.use(function (req, res, next){
    console.log("HTTP Response", res.statusCode);
});

const https = require('https');
const PORT = 3000;

let privateKey = fs.readFileSync( 'server.key.test' ); // TODO: Change this on deployment
let certificate = fs.readFileSync( 'server.crt.test' ); // TODO: Change this on deployment
let config = {
    key: privateKey,
    cert: certificate
};

https.createServer(config, app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTPS server on https://localhost:%s", PORT);
});