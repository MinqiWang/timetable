const EYE_CATCHER = "***********************************************************";
const fs = require("fs");

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

const REACT_HOMEPAGE = "http://localhost:3000";

/* ---- LOGGING ---- */

/*
 * Request LOG
 */
app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

const logAPIerror = function(API_route, error){
	console.log(EYE_CATCHER);
	console.log("Error in " + API_route + ":");
	console.log(error);
	console.log(EYE_CATCHER);
};

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

/*
 * Enable CORS for our react server
 */
/*const cors = require('cors');
let corsOptions = {
	origin: function (origin, callback) {
		console.log("CORS -- from domain: " + origin);
		callback(null, true);
		if (origin === "http://localhost:3000") {
			callback(null, true);
		}
		else {
			callback(new Error("Not allowed by CORS"));
		}
	}
}
app.use(cors(corsOptions));*/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  if ('OPTIONS' === req.method) {
	  res.sendStatus(200);
  } else {
	  next();
  }
});

/* ---- LOGGING done ---- */

/* ---- Authentication and User Management ---- */

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
	console.log("isAu:"+req.isAuthenticated());
    if (!req.isAuthenticated()) return res.status(401).end("access denied"); 
    else next();
};

/*
 * User logout; Redirect to react homepage
 */
app.get('/logout', isAuthenticated, function(req, res, next){
	req.logout();
	// res.redirect(REACT_HOMEPAGE);
	res.sendStatus(200);
});

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
	console.log("serializeUser");
	console.log(user);
    done(null, JSON.stringify(user));
});

passport.deserializeUser(function(user, done) {
	console.log("deserializeUser");
	console.log(user);
	done(null, JSON.parse(user));
});
                                     
/* 
 * User signin / signup; Redirect to react homepage if succeed
 */
app.get('/auth/facebook/', passport.authenticate('facebook'));

// signin callback
app.get('/auth/facebook/callback', passport.authenticate('facebook'), function(req, res, next){
	pool.query("select id from user where facebook_id=?", [req.user.id], function (error, results, fields){
		if (error) {
			logAPIerror("/auth/facebook/callback", error);
			res.status(500).end(error);
		}
		else {
			if (results.length === 0) {
				// Create a new user
				pool.query("insert into user values(?,?)", [null, req.user.id], function (error2, results2, fields2){
					if (error2) {
						logAPIerror("/auth/facebook/callback", error2);
						res.status(500).end(error2);
					}
					else {
						pool.query("select id from user where facebook_id=?", [req.user.id], function (error3, results3, fields3){
							if (error3) {
								logAPIerror("/auth/facebook/callback", error3);
								res.status(500).end(error3);
							}
							else {
								let avatarURL = "https://graph.facebook.com/" + req.user.id + "/picture";
								pool.query("insert into user_info values (?,?,?)", [results3[0].id, req.user.displayName, avatarURL], function (error4, results4, fields4){
									if (error4) {
										logAPIerror("/auth/facebook/callback", error4);
										res.status(500).end(error4);
									}
									else {
										req.session.inAppId = results3[0].id; // The user id in our app
										res.redirect(REACT_HOMEPAGE);
									}
								});
							}
						});
					}
				});
			}
			else {
				req.session.inAppId = results[0].id; // The user id in our app
				res.redirect(REACT_HOMEPAGE);
			}
		}
	});
	next();
    /* { id: '815763312109831',
  username: undefined,
  displayName: 'Minqi Wang',
  name: 
   { familyName: undefined,
     givenName: undefined,
     middleName: undefined },
  gender: undefined,
  profileUrl: undefined,
  provider: 'facebook',
  _raw: '{"name":"Minqi Wang","id":"815763312109831"}',
  _json: { name: 'Minqi Wang', id: '815763312109831' } } */
});

// curl -b cookie.txt http://localhost:3000/private/
// Test authentication
app.get('/private/', isAuthenticated, function (req, res, next) {
    return res.end("This is private; User id: " + req.session.inAppId);
});

/*
 * Retrieve user info 
 *
 * URL params: id -- the user id (if id is not given then retrieve the authenticated user's info)
 * Request body:
 * Response body: {name: "Ken", avatarURL: "https://graph.facebook.com/815763312109831/picture"} 
 */
app.get('/auth/retrieveUserInfo/:id?', isAuthenticated, function (req, res, next){
	let user_id = req.params.id;
	if (!user_id) {
		user_id = req.session.inAppId;
	}

	pool.query("select name, avatarURL from user_info where id=?", [user_id], function (error, results, fields) {
		if (error) {
			logAPIerror("/auth/retrieveUserInfo/:id", error);
			res.status(500).end(error);
		}
		else {
			if (results.length === 0) {
				res.status(422).end("Cannot find user with id: " + user_id);
			}
			else {
				res.json(results);
			}
		}
	});
	next(); // Correct?
});

/* ---- Authentication and User Management Done ---- */

/* ---- User friends APIs ---- */

/*
 * Send friend invitation
 *
 * URL params: user_id -- the user id
 * Request body:
 * Response body: Success/Failure messages 
 */
app.get('/friend/invite/:user_id', isAuthenticated, function (req, res, next){
	let your_id = req.session.inAppId;
	let user_id = req.params.user_id;

	if (user_id === your_id) {
		res.json("This is yourself");
	}
	else {
		pool.query("select id from user where facebook_id=?", [user_id], function (error, results, fields){
			if (error) {
				logAPIerror("/friend/invite/:user_id", error);
				res.status(500).end(error);
			}
			else {
				if (results === []) {
					res.status(422).end("Cannot find user with id: " + user_id);
				}
				else {
					// Create friend invitation
					pool.query("insert into friendship values(?,?,?) on duplicate key update", [your_id, user_id, false], function (error2, results2, fields2){
						if (error2) {
							logAPIerror("/friends/invite/:user_id", error2);
							res.status(500).end(error2);
						}
						else {
							res.json("Friend invitation is sent");
						}
					});
				}
			}
		});
	}
	next(); // Correct?
});

/*
 * Accept friend invitation
 * 
 * URL params: user_id -- the user id
 * Request body:
 * Response body: Success/Failure messages 
 */
app.get('/friend/invite/accept/:user_id', isAuthenticated, function (req, res, next){
	let your_id = req.session.inAppId;
	let user_id = req.params.user_id;

	if (user_id === your_id) {
		res.json("This is yourself!");
	}
	else {
		pool.query("select id from user where or facebook_id=?", [user_id], function (error, results, fields){
			if (error) {
				logAPIerror("/friend/invite/accept/:user_id", error);
				res.status(500).end(error);
			}
			else {
				if (results === []) {
					res.status(422).end("Cannot find user with id: " + user_id);
				}
				else {
					// Accept friend invitation
					pool.query("update friendship set has_accepted=? where id_from=? and id_to=?", [true, user_id, your_id], function(error2, results2, fields2){
						if (error2) {
							logAPIerror("/friend/invite/accept/:user_id", error2);
							res.status(500).end(error2);
						}
						else {
							res.json("Friend invitation is accepted");
						}
					});
				}
			}
		});
	}
	next(); // Correct?
});

/*
 * Retrieve the friendlist
 *
 * URL params:
 * Request body:
 * Response body: [1, 2, 3, 4, 5] (where 1, 2, 3, 4, 5 are all user ids)
 */
app.get("/friend/retrieveAll", isAuthenticated, function (req, res, next){
	let your_id = req.session.inAppId;

	pool.query("select * from friendship where (id_from=? or id_to=?) and has_accepted=?", [your_id, your_id, true], function (error, results, fields){
		if (error) {
			logAPIerror("friend/retrieveAll", error);
			res.status(500).end(error);
		}
		else {
			let friendlist = [];
			for (let i = 0; i < results.length; i++ ) {
				let from = results[i].id_from;
				let to = results[i].id_to;
				if (from === your_id) {
					friendlist.push(to);
				}
				else if (to === your_id) {
					friendlist.push(from);
				}
			}
			res.json(friendlist);
		}
	});
	next(); // Correct?
});

/* ---- User friends APIs done ---- */

/* ---- Personal Event APIs ---- */

/*
 * Create an event and its timetable slots.
 *
 * URL params:
 * Request body: {detail: [TEXT_CONTENT, MEDIA_CONTENT_URLS, PLACE_NAME], timetable_slots: [[EVENT_NAME, EVENT_HAS_DETAIL, 
 * START_TIME, LENGTH, WEEK_OF, DAY_OF_THE_WEEK, IS_REPEATING], [...] ...]}
 * Request body example: {detail: ["Hello World", "IMAGE_URL1, VIDEO_URL1, VIDEO_URL2, ...", "UTSC"], timetable_slots: 
 * [["event1", true, "8:45:00", "15", "2019-03-17", 1, false], [...] ...]}
 * Response body: Success/Failure messages 
 */
app.post('/event/create', isAuthenticated, function(req, res, next){
	let event_detail = req.body.detail;
	let timetable_slots = req.body.timetable_slots; // Does not contain an event id
	let author_id = req.session.inAppId;

	let num_slots = timetable_slots.length;
	let num_finished = 0;

	// Create event ownership first
	pool.query("insert into event_ownership values (?,?)", [null, author_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/create", error);
			res.status(500).end(error);
		}
		else {
			// Create event details
			pool.query("insert into event_detail values (?,?,?,?)", [results.insertId].concat(event_detail), function (error2, results2, fields2){
				if (error2) {
					logAPIerror("/event/create", error2);
					res.status(500).end(error2);
				}
				else {
					// Create the timetable slots
					for (let i = 0; i < num_slots; i++) {
						pool.query("insert into timetable_event values (?,?,?,?,?,?,?,?,?)", [null, results.insertId].concat(timetable_slots[i]), function (error3, results3, fields3) {
							if (error3) {
								logAPIerror("/event/create", error3);
								res.status(500).end(error3);
							}
							else {
								num_finished += 1;
								if (num_finished == num_slots) {
									res.json("Event is created!");
								}
							}
						});
					}
				}
			});
		}
	});
	next(); // Correct?
});

/*
 * Add a timetable slot for an event.
 * If any slot is obscured by this slot (specified by req.body.obscure), update the database accordingly.
 *
 * URL params:
 * Request body: {"event_id": EVENT_ID, "obscure_id": OBSCURE_ID, "timetable_slot": [EVENT_NAME, EVENT_HAS_DETAIL, 
 * START_TIME, LENGTH, WEEK_OF, DAY_OF_THE_WEEK, IS_REPEATING]}
 * Request body example: {"event_id": 1, "obscure_id": 2, "timetable_slot": ["event1", true, "8:45:00", "15", "2019-03-17", 1, false], "week_of": "2019-03-17"}
 * Response body: Success/Failure messages 
 */
 app.post('/event/timetable_slot/create', isAuthenticated, function (req, res, next){
 	let timetable_slot = req.body.timetable_slot; // Does not contain an event id
 	let event_id = req.body.event_id;
 	let obscure_id = req.body.obscure; // Slot id
 	let week_of = req.body.week_of;
 	let author_id = req.session.inAppId;

	// Verify event ownership first
	pool.query("select event_id from event_ownership where author_id=? and event_id=?", [author_id, event_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/timetable_slot/create", error);
			res.status(500).end(error);
		}
		else if (results === []) {
			res.status(401).end("Access Denied");
		}
		else {
		 	pool.query("insert into timetable_event values(?,?,?,?,?,?,?,?,?)", [null, event_id].concat(timetable_slot), function (error2, results2, fields2){
		 		if (error2) {
		 			logAPIerror("/event/timetable_slot/create", error2);
		 			res.status(500).end(error2);
		 		}
		 		else {
		 			// Update the slot that is obscured
		 			if (obscure_id !== null) {
		 				pool.query("insert into obscured_event values(?,?)", [obscure_id, week_of], function(error3, results3, fields3){
		 					if (error3) {
		 						logAPIerror("/event/timetable_slot/create", error3);
		 						res.status(500).end(error3);
		 					}
		 					else {
		 						res.json("Timetable slot is created!");
		 					}
		 				});
		 			}
		 			else {
		 				res.json("Timetable slot is created!");
		 			}
		 		}
		 	});
		}
	});
 	next(); // Correct?
 });

/*
 * Update an event.
 *
 * URL params:
 * Request body: {"event_id": EVENT_ID, event_detail: [TEXT_CONTENT, MEDIA_CONTENT_URLS, PLACE_NAME], event_name: EVENT_NAME}
 * Request body example: {"event_id": 1, event_detail: ["Hello World", "IMAGE_URL1, VIDEO_URL1, VIDEO_URL2, ...", "UTSC"], event_name: "event1"}
 * Response body: Success/Failure messages 
 */
app.patch('/event/update', isAuthenticated, function (req, res, next){
	let event_detail = req.body.detail;
 	let event_id = req.body.event_id;
 	let event_name = req.body.event_name;
	let author_id = req.session.inAppId;


	pool.query("select event_id from event_ownership where author_id=? and event_id=?", [author_id, event_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/update", error);
			res.status(500).end(error);
		}
		else if (results === []) {
			res.status(401).end("Access Denied");
		}
		else {
			pool.query("update event_detail set text_content=?, media_content_urls=?, place=? where id=?", event_detail.concat(event_id), function (error2, results2, fields2){
				if (error2) {
					logAPIerror("/event/update", error2);
					res.status(500).end(error2);
				}
				else {
					// Update event name
					pool.query("update timetable_event set event_name=? where event_id=?", [event_name, event_id], function (error3, results3, fields3){
						if (error3) {
							logAPIerror("/event/update", error3);
							res.status(500).end(error3);
						}
						else {
							res.json("Event is updated!");
						}
					});
				}
			});
		}
	});
	next(); // Correct?
});

/*
 * Update a timetable slot
 *
 * URL params:
 * Request body; {"event_id": EVENT_ID, "id": "slot_id": TIMETABLE_SLOT_ID, "timetable_slot": [START_TIME, LENGTH, DAY_OF_THE_WEEK]}
 * Request body example: {"event_id": 1, "id": 1, "timetable_slot": ["8:45:00", "15", 1]}
 * Response body: Success/Failure messages 
 */
app.patch('/event/timetable_slot/update', isAuthenticated, function (req, res, next){
	let timetable_slot = req.body.timetable_slot;
 	let event_id = req.body.event_id;
 	let author_id = req.session.inAppId;
	let slot_id = req.body.id;

	pool.query("select event_id from event_ownership where author_id=? and event_id=?", [author_id, event_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/timetable_slot/update", error);
			res.status(500).end(error);
		}
		else if (results === []) {
			res.status(401).end("Access Denied");
		}
		else {
			pool.query("update timetable_event set start_time=?, length=?, day_of_the_week=? where id=?", timetable_slot.concat(event_id), function (error2, results2, fields2){
				if (error2) {
					logAPIerror("/event/timetable_slot/update", error2);
					res.status(500).end(error2);
				}
				else {
					res.json("Timetable slot is updated!");
				}
			});
		}
	});
	next(); // Correct?
});

/*
 * Delete a timetable slot.
 *
 * URL params: slot_id -- The id of the timetable slot to delete; event_id -- The id the corresponding event
 * Request body:
 * Response body: Success/Failure messages
 */
app.delete('/event/timetable_slot/delete/:id/:event_id', isAuthenticated, function (req, res, next){
	let slot_id = req.params.id;
	let event_id = req.params.event_id;
	let author_id = req.session.inAppId;

	pool.query("select event_id from event_ownership where author_id=? and event_id=?", [author_id, event_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/timetable_slot/delete", error);
			res.status(500).end(error);
		}
		else if (results === []) {
			res.status(401).end("Access Denied");
		}
		else {
			pool.query("delete from timetable_event where id=?", [slot_id], function (error, results, fields){
				if (error) {
					logAPIerror("/event/timetable_slot/delete", error);
					res.status(500).end(error);
				}
				else {
					res.json("Timetable slot is deleted!");
				}
			});
		}
	});
	next(); // Correct?
});

/*
 * Delete an event and its timetable slots.
 *
 * URL params: id -- The id of the event to delete
 * Reqeust body:
 * Response body: Success/Failure messages
 */
app.delete("/event/delete/:id", isAuthenticated, function (req, res, next){
	let event_id = req.params.id;
	let author_id = req.session.inAppId;

	pool.query("select event_id from event_ownership where author_id=? and event_id=?", [author_id, event_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/delete", error);
			res.status(500).end(error);
		}
		else if (results === []) {
			res.status(401).end("Access Denied");
		}
		else {
			pool.query("delete from event_ownership where event_id=?", [event_id], function (error2, results2, fields2){
				if (error2) {
					logAPIerror("/event/delete", error2);
					res.status(500).end(error2);
				}
				else {
					/*// Delete the timetable slots
					pool.query("delete from timetable_event where event_id=?", [event_id], function (error3 ,results3, fields3){
						if (error3) {
							logAPIerror("/event/delete", error3);
							res.status(500).end(error3);
						}
						else {
							res.json("Event is deleted!");
						}
					});*/
					res.json("Event is deleted!");
				}
			});
		}
	});
	next(); // Correct?
});

/* 
 * Retrieve all timetable slots for a given week.
 *
 * URL params: week_of -- The "week-of" day
 * Reqeust body:
 * Response body: [[SLOT_ID, EVENT_ID, EVENT_NAME, EVENT_HAS_DETAIL, START_TIME, LENGTH, WEEK_OF, DAY_OF_THE_WEEK, IS_REPEATING], [...], ...]
 * Response body example:
 [
    {
        "id": 3,
        "event_id": 2,
        "event_name": "event1",
        "event_has_detail": 1,
        "start_time": "8:45:00",
        "length": 15,
        "week_of": "2019-03-17",
        "day_of_the_week": 1,
        "is_repeating": 0
    },
    {
        "id": 4,
        "event_id": 2,
        "event_name": "event1",
        "event_has_detail": 1,
        "start_time": "9:45:00",
        "length": 15,
        "week_of": "2019-03-17",
        "day_of_the_week": 1,
        "is_repeating": 1
    }
]
 */
app.get("/event/timetable_slot/retrieveAll/:week_of", isAuthenticated, function (req, res, next){
	let week_of = req.params.week_of;
	let author_id = req.session.inAppId;

	pool.query("select * from timetable_event where week_of=? and id not in (select slot_id from obscured_event where week_of=?) \
		and event_id in (select event_id from event_ownership where author_id=?)", [week_of, week_of, author_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/timetable_slot/retrieveAll:week_of", error);
			res.status(500).end(error);
		}
		else {
			// Format the data
			let formatted_results = {Sun: [], Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: []};
			for (let i = 0; i < results.length; i++) {
				switch (results[i][8]) {
					case 0:
						formatted_results.Sun.push(results[i]);
						break;
					case 1:
						formatted_results.Mon.push(results[i]);
						break;
					case 2:
						formatted_results.Tue.push(results[i]);
						break;
					case 3:
						formatted_results.Wed.push(results[i]);
						break;
					case 4:
						formatted_results.Thu.push(results[i]);
						break;
					case 5:
						formatted_results.Fri.push(results[i]);
						break;
					case 6:
						formatted_results.Sat.push(results[i]);
						break;
				}
			}
			res.json(formatted_results);
		}
	});
	next(); // Correct?
});

/*
 * Retrieve the detailed information for a given event.
 *
 * URL params: id -- The id of the event
 * Request body:
 * Response body: [EVENT_ID, TEXT_CONTENT, MEDIA_CONTENT_URLS, PLACE]
 * Response body example: 
 [
    {
        "id": 2,
        "text_content": "Hello world!",
        "media_content_urls": "",
        "place": "UTSC"
    }
 ]
 */
app.get("/event/retrieve/:id", isAuthenticated, function (req, res, next){
	let event_id = req.params.id;
	let author_id = req.session.inAppId;

	pool.query("select * from event_detail where id=?", [event_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/retrieve:id", error);
			res.status(500).end(error);
		}
		else {
			res.json(results);
		}
	});
	next(); // Correct?
});

/* ---- Personal Event APIs done ---- */


/* ---- Group Event APIs ---- */

/*
 * Create a group event. (Add a list of invitees)
 *
 * URL params:
 * Reqeust body: {id: EVENT_ID, invitees: [USER_ID1, USER_ID2, ...]}
 * Response body: Success/Failure messages
 */
app.post("/event/group/create", isAuthenticated, function (req, res, next){
	let event_id = req.body.id;
	let author_id = req.session.inAppId;
	let invitees = req.body.invitees;

	pool.query("select event_id from event_ownership where author_id=? and event_id=?", [author_id, event_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/group/create", error);
			res.status(500).end(error);
		}
		else if (results === []) {
			res.status(401).end("Access Denied");
		}
		else {
			let num_invitees = invitees.length;
			let num_finished = 0;

			for (let i = 0; i < num_invitees; i++) {
				pool.query("insert into group_event_invitation values(?,?,?)", [event_id, invitees[i], false], function (error2, results2, fields2){
					if (error2) {
						logAPIerror("/event/group/create", error2);
						res.status(500).end(error2);
					}
					else {
						num_finished += 1;
						if (num_finished == num_invitees) {
							res.json("Group event is created! / Invitees are added!");
						}
					}
				});
			}
		}
	});
	next(); // Correct?
});

/*
 * Accept a group event.
 *
 * URL params:
 * Request body: {id: EVENT_ID} 
 * Response body: Success/Failure messages
 */
app.post("/event/group/accept", isAuthenticated, function (req, res, next){
	let event_id = req.body.id;
	let user_id = req.session.inAppId;

	pool.query("update group_event_invitation set has_accepted=? where event_id=? and Invitee=?", [true, event_id, user_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/group/accept", error);
			res.status(500).end(error);
		}
		else {
			res.json("Group event is accepted!");
		}
	});
	next(); // Correct?
});

/* ---- Group Event APIs done ---- */

/*
 * Response LOG
 */
app.use(function (req, res, next){
    console.log("HTTP Response", res.statusCode);
});

const https = require('https');
const PORT = 8000;

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