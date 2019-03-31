const EYE_CATCHER = "***********************************************************";
const fs = require("fs");
const validator = require('validator');

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

const REACT_HOMEPAGE = "https://localhost:3000";

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
  res.header("Access-Control-Allow-Origin", REACT_HOMEPAGE);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS, PATCH");
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
 * TODO: Twitter authentication
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
app.get('/retrieveUserInfo/:id?', isAuthenticated, function (req, res, next){
	let user_id = req.params.id;
	if (!user_id) {
		user_id = req.session.inAppId;
	} else {
		if (!validator.isNumeric(user_id)) {
			return res.status(422).end("URL param: id must be an integer");
		}
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
app.post('/friend/invite/:user_id', isAuthenticated, function (req, res, next){
	let your_id = req.session.inAppId;
	let user_id = req.params.user_id;

	if (!validator.isNumeric(user_id)) {
		return res.status(422).end("URL param: user_id must be an integer");
	}

	if (user_id == your_id) {
		res.json("This is yourself");
	}
	else {
		pool.query("select id from user where id=?", [user_id], function (error, results, fields){
			if (error) {
				logAPIerror("/friend/invite/:user_id", error);
				res.status(500).end(error);
			}
			else {
				if (results.length === 0) {
					res.status(422).end("Cannot find user with id: " + user_id);
				}
				else {
					pool.query("select * from friendship where id_from=? and id_to=? or id_from=? and id_to=?", [your_id, user_id, user_id, your_id], function (error2, results2, fields2){
						if (error2) {
							logAPIerror("/friends/invite/:user_id", error2);
							res.status(500).end(error2);
						}
						else {
							if (results2.length !== 0) {
								res.json("Already friends or friend request already exists!");
							}
							else {
								// Create friend invitation
								pool.query("insert into friendship values(?,?,?)", [your_id, user_id, false], function (error3, results3, fields3){
									if (error3) {
										logAPIerror("/friends/invite/:user_id", error3);
										res.status(500).end(error3);
									}
									else {
										res.json("Friend request is sent!");
									}
								});
							}
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
app.patch('/friend/invite/accept/:user_id', isAuthenticated, function (req, res, next){
	let your_id = req.session.inAppId;
	let user_id = req.params.user_id;

	if (!validator.isNumeric(user_id)) {
		return res.status(422).end("URL param: user_id must be an integer");
	}

	if (user_id == your_id) {
		return res.json("This is yourself!");
	}
	else {
		pool.query("select id from user where id=?", [user_id], function (error, results, fields){
			if (error) {
				logAPIerror("/friend/invite/accept/:user_id", error);
				res.status(500).end(error);
			}
			else {
				if (results.length === 0) {
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
 * Reject friend invitation
 * 
 * URL params: user_id -- the user id
 * Request body:
 * Response body: Success/Failure messages 
 */
app.delete('/friend/invite/reject/:user_id', isAuthenticated, function (req, res, next){
	let your_id = req.session.inAppId;
	let user_id = req.params.user_id;

	if (!validator.isNumeric(user_id)) {
		return res.status(422).end("URL param: user_id must be an integer");
	}

	if (user_id == your_id) {
		return res.json("This is yourself!");
	}
	else {
		pool.query("select id from user where id=?", [user_id], function (error, results, fields){
			if (error) {
				logAPIerror("/friend/invite/reject/:user_id", error);
				res.status(500).end(error);
			}
			else {
				if (results.length === 0) {
					res.status(422).end("Cannot find user with id: " + user_id);
				}
				else {
					// Reject friend invitation
					pool.query("delete from friendship where has_accepted=? and id_from=? and id_to=?", [false, user_id, your_id], function(error2, results2, fields2){
						if (error2) {
							logAPIerror("/friend/invite/reject/:user_id", error2);
							res.status(500).end(error2);
						}
						else {
							res.json("Friend invitation is rejected");
						}
					});
				}
			}
		});
	}
	next(); // Correct?
});

/*
 * Retrieve the friendlist or pending friend requests
 *
 * URL params:
 * Request body:
 * Response body:
 */
app.get("/friend/retrieveAll/:opt", isAuthenticated, function (req, res, next){
	let your_id = req.session.inAppId;
	let opt = req.params.opt;
	let queryStr = undefined;
	if (opt == "friendlist") {
		queryStr = "select * from (select * from friendship join user_info on (id_from=id or id_to=id) where (id_from=? or id_to=?) and has_accepted=true) A where id!=?";
	}
	else if (opt == "pendingRequests") {
		queryStr = "select * from friendship join user_info on id_from=id where id_to=? and id_to=? and id_to=? and has_accepted=false";
	}
	else {
		return res.status(422).end("URL param: opt must be one of ('friendlist', 'pendingRequests')");
	}

	pool.query(queryStr, [your_id, your_id, your_id], function (error, results, fields){
		if (error) {
			logAPIerror("friend/retrieveAll", error);
			res.status(500).end(error);
		}
		else {
			res.json(results);
		}
	});
	next(); // Correct?
});

/*
 * Retrieve user info with friendship status.
 */
app.get('/retrieveUserInfo/withFriendship/:id', isAuthenticated, function (req, res, next){
	let user_id = req.params.id;
	let your_id = req.session.inAppId;

	if (!validator.isNumeric(user_id)) {
		return res.status(422).end("URL param: id must be an integer");
	}

	if (user_id == your_id) return res.json("This is you!");
	pool.query("select * from (select * from user_info left join friendship on id=id_from or id=id_to where id=?) A where id_from=? or id_to=? or id_from is null limit 1", [user_id, your_id, your_id], function (error, results, fields){
		if (error) {
			logAPIerror("/retrieveUserInfo/withFriendship/:id", error);
			res.status(500).end(error);
		}
		else {
			res.json(results[0]);
		}
	});
	next();
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
	if (!(Array.isArray(req.body.timetable_slots) && Array.isArray(req.body.detail))) {
		return res.status(422).end("Body: timetable_slots must be an array, detail must be an array");
	}

	let event_detail = req.body.detail.map(x => (typeof x === 'string' || x instanceof String) ? validator.escape(x) : x);
	let timetable_slots = req.body.timetable_slots.map(a => (a.map(x => (typeof x === 'string' || x instanceof String) ? validator.escape(x) : x))); // Does not contain an event id
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
 	if (!(Array.isArray(req.body.timetable_slots))) {
		return res.status(422).end("Body: timetable_slot must be an array");
	}
 	let timetable_slot = req.body.timetable_slot.map(x => (typeof x === 'string' || x instanceof String) ? validator.escape(x) : x); // Does not contain an event id
 	let event_id = req.body.event_id;
 	let obscure_id = req.body.obscure; // Slot id
 	let week_of = validator.escape(req.body.week_of);
 	let author_id = req.session.inAppId;

	// Verify event ownership first
	pool.query("select event_id from event_ownership where author_id=? and event_id=?", [author_id, event_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/timetable_slot/create", error);
			res.status(500).end(error);
		}
		else if (results.length === 0) {
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
	if (!(Array.isArray(req.body.timetable_slots) && Array.isArray(req.body.event_detail))) {
		return res.status(422).end("Body: event_id must be an integer");
	}

	let event_detail = req.body.detail.map(x => (typeof x === 'string' || x instanceof String) ? validator.escape(x) : x);
 	let event_id = req.body.event_id;
 	let event_name = validator.escape(req.body.event_name);
	let author_id = req.session.inAppId;


	pool.query("select event_id from event_ownership where author_id=? and event_id=?", [author_id, event_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/update", error);
			res.status(500).end(error);
		}
		else if (results.length === 0) {
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
 * Request body example: {"event_id": 1, "id": 1, "timetable_slot": ["8:45:00", "15", "2019-03-24", 1]}
 * Response body: Success/Failure messages 
 */
app.patch('/event/timetable_slot/update', isAuthenticated, function (req, res, next){
	if (!(Array.isArray(req.body.timetable_slot))) {
		return res.status(422).end("Body: timetable_slot must be an array");
	}

	let timetable_slot = req.body.timetable_slot.map(x => (typeof x === 'string' || x instanceof String) ? validator.escape(x) : x);
 	let event_id = req.body.event_id;
 	let author_id = req.session.inAppId;
	let slot_id = req.body.id;

	pool.query("select event_id from event_ownership where author_id=? and event_id=?", [author_id, event_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/timetable_slot/update", error);
			res.status(500).end(error);
		}
		else if (results.length === 0) {
			res.status(401).end("Access Denied");
		}
		else {
			pool.query("update timetable_event set start_time=?, length=?, week_of=?, day_of_the_week=? where id=?", timetable_slot.concat(slot_id), function (error2, results2, fields2){
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
	if (!(validator.isNumeric(req.params.id) && validator.isNumeric(req.params.event_id))) {
		return res.status(422).end("URL param: id must an integer, event_id must be an integer");
	}
	let slot_id = req.params.id;
	let event_id = req.params.event_id;
	let author_id = req.session.inAppId;

	pool.query("select event_id from event_ownership where author_id=? and event_id=?", [author_id, event_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/timetable_slot/delete", error);
			res.status(500).end(error);
		}
		else if (results.length === 0) {
			res.status(401).end("Access Denied");
		}
		else {
			pool.query("delete from timetable_event where id=?", [slot_id], function (error2, results2, fields2){
				if (error2) {
					logAPIerror("/event/timetable_slot/delete", error2);
					res.status(500).end(error2);
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
	if (!validator.isNumeric(req.params.id)) {
		return res.status(422).end("URL param: id must an integer");
	}
	let event_id = req.params.id;
	let author_id = req.session.inAppId;

	pool.query("select event_id from event_ownership where author_id=? and event_id=?", [author_id, event_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/delete", error);
			res.status(500).end(error);
		}
		else if (results.length === 0) {
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

function formatSlotsInfo(results) {
	let event_name = null;
	let formatted_results = {Sun: [], Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: []};
	for (let i = 0; i < results.length; i++) {
		console.log(results[i], results[i].day_of_the_week);
		event_name = results[i].event_name;
		switch (results[i].day_of_the_week) {
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
	return [formatted_results, event_name];
}

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
	let week_of = validator.escape(req.params.week_of);
	let author_id = req.session.inAppId;

	pool.query("select * from timetable_event where event_id in (select event_id from event_ownership where author_id=?) \
		and (week_of=? or (week_of<? and is_repeating=true))", [author_id, week_of, week_of], function (error, results, fields){
		if (error) {
			logAPIerror("/event/timetable_slot/retrieveAll:week_of", error);
			res.status(500).end(error);
		}
		else {
			// Format the data
			let formatted_results = formatSlotsInfo(results)[0];
			res.json(formatted_results);
		}
	});
	next(); // Correct?
});

/*
 * Retrieve all timetable slots + detail info for a given event
 */
app.get("/event/timetable_slot/retrieveAllForEvent/:id", isAuthenticated, function (req, res, next){
	if (!validator.isNumeric(req.params.id)) {
		return res.status(422).end("URL param: id must an integer");
	}
	let event_id = req.params.id;
	let author_id = req.session.inAppId;

	pool.query("select * from timetable_event where timetable_event.event_id=?", [event_id], function (error2, results2, fields2){
		if (error2) {
			logAPIerror("/event/timetable_slot/retrieveAllForEvent/:id", error2);
			res.status(500).end(error2);
		}
		else {
			// Format the data
			let formatted_slots_results = formatSlotsInfo(results2);
			pool.query("select * from event_detail join event_ownership on id=event_id where id=?", [event_id], function (error3, results3, fields3) {
				if (error3) {
					logAPIerror("/event/timetable_slot/retrieveAllForEvent/:id", error3);
					res.status(500).end(error3);
				}
				else {
					let event_detail = results3[0];
					event_detail.event_name = formatted_slots_results[1];
					res.json({"detail": event_detail, "timetable_slots": formatted_slots_results[0]});
				}
			});
		}
	});
	next();
});

/*
 * Create, update, delete slots + Update detail info for a given event
 *
 * Request body example:
 {
	"detail_info": ["text content", "URL1,URL2,URL3", "UTSC"],
	"to_create": 
	[
		["new event name", true, "15:30:00", 30, "2019-03-25", 2, false],
		["new event name", true, "18:00:00", 60, "2019-03-25", 3, true]
	],
	"to_update":
	[
		["new event name", "9:30:00", 30, "2019-04-01", 0, 3],
		["new event name", "10:30:00", 30, "2019-04-01", 1, 4]
	],
	"to_delete":
	[5,6]
 }
 */
app.post("/event/MISC/:id", isAuthenticated, function (req, res, next){
	if (!(validator.isNumeric(req.params.id) && Array.isArray(req.body.detail_info) && Array.isArray(req.body.to_create) && Array.isArray(req.body.to_update) && Array.isArray(req.body.to_delete))) {
		return res.status(422).end("URL param: id must an integer; Body: detail_info must be an array, to_create must be an array, to_update must be an array, to_delete must be an array");
	}
	let event_id = req.params.id;
	let author_id = req.session.inAppId;
	let detail_info = req.body.detail_info.map(x => (typeof x === 'string' || x instanceof String) ? validator.escape(x) : x);
	let to_create = req.body.to_create.map(a => (a.map(x => (typeof x === 'string' || x instanceof String) ? validator.escape(x) : x)));
	let to_update = req.body.to_update.map(a => (a.map(x => (typeof x === 'string' || x instanceof String) ? validator.escape(x) : x)));
	let to_delete = req.body.to_delete.map(a => (a.map(x => (typeof x === 'string' || x instanceof String) ? validator.escape(x) : x)));

	pool.query("select * from event_ownership where author_id=? and event_id=?", [author_id, event_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/MISC/:id", error);
			res.status(500).end(error);
		}
		else {
			let create_slots = function () {
				// Finished all updates, do create new slots
				if (to_create.length === 0) {
					return res.json("MISC updates for event " + event_id + " succeeded!");
				}
				let num_processed_creates = 0;
				for (let i3 = 0; i3 < to_create.length; i3++) {
					pool.query("insert into timetable_event values (?,?,?,?,?,?,?,?,?)", [null, event_id].concat(to_create[i3]), function (error5, results5, fields5){
						if (error5) {
							logAPIerror("/event/MISC/:id", error5);
							res.status(500).end(error5);
						}
						else {
							num_processed_creates += 1;
							if (num_processed_creates == to_create.length) {
								res.json("MISC updates for event " + event_id + " succeeded!");
							}
						}
					});
				}
			};
			let update_slots = function () {
				if (to_update.length === 0) {
					return create_slots();
				}
				// Finished all deletions, do update slots
				let num_processed_updates = 0;
				for (let i2 = 0; i2 < to_update.length; i2++) {
					pool.query("update timetable_event set event_name=?, start_time=?, length=?, week_of=?, day_of_the_week=? where id=?", to_update[i2] ,function (error4, results4, fields4){
						if (error4) {
							logAPIerror("/event/MISC/:id", error4);
							res.status(500).end(error4);
						}
						else {
							num_processed_updates += 1;
							if (num_processed_updates === to_update.length) {
								create_slots();
							}
						}
					});
				}
			};
			let delete_slots = function () {
				if (to_delete.length === 0) {
					return update_slots();
				}
				// delete slots
				let num_processed_deletes = 0;
				for (let i = 0; i < to_delete.length; i++) {
					pool.query("delete from timetable_event where id=?", [to_delete[i]], function (error3, results3, fields3){
						if (error3) {
							logAPIerror("/event/MISC/:id", error3);
							res.status(500).end(error3);
						}
						else {
							num_processed_deletes += 1;
							if (num_processed_deletes === to_delete.length) {
								update_slots();
							}
						}
					});
				}
			};
			let update_detail = function () {
				if (detail_info.length === 0) {
					delete_slots();
				}
				else {
					pool.query("update event_detail set text_content=?, media_content_urls=?, place=? where id=?", detail_info.concat(event_id), function(error, results, fileds){
						if (error) {
							logAPIerror("/event/MISC/:id", error);
							res.status(500).end(error);
						}
						else {
							delete_slots();
						}
					});
				}
			}
			update_detail();
		}
	});
	next();
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
	if (!validator.isNumeric(req.params.id)) {
		return res.status(422).end("URL param: id must an integer");
	}
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
 * Get all users which can be invited to the given event.
 */
app.get("/event/group/toInvite/:id", isAuthenticated, function (req, res, next){
	if (!validator.isNumeric(req.params.id)) {
		return res.status(422).end("URL param: id must an integer");
	}
	let event_id = req.params.id;
	let user_id = req.session.inAppId;

	pool.query("select * from user_info where id not in (select invitee from group_event_invitation where event_id=?) and id!=?", [event_id, user_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/group/toInvite/:id", error);
			res.status(500).end(error);
		}
		else {
			res.json(results);
		}
	});
});

/*
 * Get all users which are already invited to the given event.
 */
app.get("/event/group/invited/:id", isAuthenticated, function (req, res, next){
	if (!validator.isNumeric(req.params.id)) {
		return res.status(422).end("URL param: id must an integer");
	}
	let event_id = req.params.id;
	let user_id = req.session.inAppId;

	pool.query("select * from user_info join group_event_invitation on id=invitee where event_id=?", [event_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/group/invited/:id", error);
			res.status(500).end(error);
		}
		else {
			res.json(results);
		}
	});
});

/*
 * Create a group event. (Add a list of invitees)
 *
 * URL params: id -- The id of the group event
 * Reqeust body: {invitees: [USER_ID1, USER_ID2, ...]}
 * Response body: Success/Failure messages
 */
app.post("/event/group/create/:id", isAuthenticated, function (req, res, next){
	if (!(validator.isNumeric(req.params.id) && Array.isArray(req.body.invitees))) {
		return res.status(422).end("URL param: id must an integer");
	}
	let event_id = req.params.id;
	let author_id = req.session.inAppId;
	let invitees = req.body.invitees.map(x => (typeof x === 'string' || x instanceof String) ? validator.escape(x) : x);

	pool.query("select event_id from event_ownership where author_id=? and event_id=?", [author_id, event_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/group/create", error);
			res.status(500).end(error);
		}
		else if (results.length === 0) {
			res.status(401).end("Access Denied");
		}
		else {
			let num_invitees = invitees.length;
			let num_finished = 0;

			for (let i = 0; i < num_invitees; i++) {
				if (invitees[i] == author_id) {
					num_finished += 1;
					continue;
				}
				pool.query("select * from user where id=?", [invitees[i]], function (error2, results2, fields2){
					if (error2) {
						logAPIerror("/event/group/create", error2);
						res.status(500).end(error2);
					}
					else {
						if (results2.length === 0) {
							res.status(422).end("Cannot find user with id: " + invitees[i]);
						}
						else {
							pool.query("insert ignore into group_event_invitation values(?,?,?,now())", [event_id, invitees[i], null], function (error3, results3, fields3){
								if (error3) {
									logAPIerror("/event/group/create", error3);
									res.status(500).end(error3);
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
			}
		}
	});
	next(); // Correct?
});

/*
 * Accept a group event invitation.
 *
 * URL params: id -- The id of the group event
 * Request body:
 * Response body: Success/Failure messages
 */
app.patch("/event/group/accept/:id", isAuthenticated, function (req, res, next){
	if (!validator.isNumeric(req.params.id)) {
		return res.status(422).end("URL param: id must an integer");
	}
	let event_id = req.params.id;
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

/*
 * Reject a group event invitation.
 *
 * URL params: id -- The id of the group event
 * Request body: 
 * Response body: Success/Failure messages
 */
app.patch("/event/group/reject/:id", isAuthenticated, function (req, res, next){
	if (!validator.isNumeric(req.params.id)) {
		return res.status(422).end("URL param: id must an integer");
	}
	let event_id = req.params.id;
	let user_id = req.session.inAppId;

	pool.query("update group_event_invitation set has_accepted=? where event_id=? and Invitee=?", [false, event_id, user_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/group/reject", error);
			res.status(500).end(error);
		}
		else {
			res.json("Group event is rejected!");
		}
	});
	next(); // Correct?
});

/*
 * Decline a group event invitation sent by yourself.
 * Can only decline an inviation which is not accepted or rejected.
 *
 * URL params: id -- The id of the group event
 * Request body: {id: EVENT_ID} 
 * Response body: Success/Failure messages
 */
app.delete("/event/group/decline/:id/:invitee_id", isAuthenticated, function (req, res, next){
	if (!(validator.isNumeric(req.params.id) && validator.isNumeric(req.params.invitee_id))) {
		return res.status(422).end("URL param: id must be an integer, invitee_id must be an integer");
	}
	let event_id = req.params.id;
	let invitee_id = req.params.invitee_id;
	let user_id = req.session.inAppId;

	// Check the ownership
	pool.query("select event_id from event_ownership where author_id=? and event_id=?", [user_id, event_id], function (error, results, fields){
		if (error) {
			logAPIerror("/event/group/decline", error);
			res.status(500).end(error);
		}
		else if (results.length === 0){
			res.status(401).end("Access Denied");
		}
		else {
			pool.query("delete from group_event_invitation where event_id=? and invitee=? and has_accepted is null", [event_id, invitee_id], function (error2, results2, fields2){
				if (error2) {
					logAPIerror("/event/group/decline", error2);
					res.status(500).end(error2);
				}
				else {
					res.json("Group event is declined!");
				}
			});
		}
	});
	next();
});

/*
 * Retrieve all received group event invitation for a given week.
 */
app.get("/event/group/timetable_slot/retrieveAllInvited/:week_of", isAuthenticated, function (req, res, next){
	let week_of = validator.escape(req.params.week_of);
	let author_id = req.session.inAppId;

	pool.query("select * from timetable_event where event_id in (select event_id from group_event_invitation where invitee=? and has_accepted=true) and week_of=?", [author_id, week_of], function (error, results, fields){
		if (error) {
			logAPIerror("/event/timetable_slot/retrieveAllInvited/:week_of", error);
			res.status(500).end(error);
		}
		else {
			let formatted_results = formatSlotsInfo(results)[0];
			res.json(formatted_results);
		}
	});
	next();
});

/*
 * Retrieve next 10 received group event invitation, start at the n'th event where n is given as a param.
 */
app.get("/event/group/timetable_slot/retrieveInvited/:n", isAuthenticated, function (req, res, next){
	if (!validator.isNumeric(req.params.n)) {
		return res.status(422).end("URL param: n must an integer");
	}
	let n = req.params.n;
	let author_id = req.session.inAppId;

	pool.query("select timetable_event.event_id, event_name, name, avatarURL, has_accepted from timetable_event join user_info join event_ownership on timetable_event.event_id=event_ownership.event_id and event_ownership.author_id=user_info.id \
		join (select t.event_id, t.has_accepted from (select event_id, has_accepted from group_event_invitation where invitee=? order by ts desc limit ?,?) as t) A on timetable_event.event_id=A.event_id group by timetable_event.event_id, event_name, name, \
		avatarURL, has_accepted", [author_id, 10 * parseInt(n), 10 * (parseInt(n)+1)], function (error, results, fields){
		if (error) {
			logAPIerror("/event/timetable_slot/retrieveInvited/:n", error);
			res.status(500).end(error);
		}
		else {
			res.json(results);
		}
	});
	next();
});

/*
 * Retrieve next 10 group event initialized by you, start at the n'th event where n is given as a param.
 */
app.get("/event/group/event/retrieveSent/:n", isAuthenticated, function (req, res, next){
	if (!validator.isNumeric(req.params.n)) {
		return res.status(422).end("URL param: n must an integer");
	}
	let n = req.params.n;
	let author_id = req.session.inAppId;


	pool.query("select event_id, event_name from timetable_event where event_id in (select t2.event_id \
		from (select distinct t.event_id from (select event_ownership.event_id from group_event_invitation \
		join event_ownership on group_event_invitation.event_id=event_ownership.event_id where author_id=? \
		order by ts desc) as t limit ?,?) as t2) group by event_id, event_name", [author_id, 10 * parseInt(n), 10 * (parseInt(n)+1)], function (error, results, fields){
		if (error) {
			logAPIerror("/event/timetable_slot/retrieveInvited/:n", error);
			res.status(500).end(error);
		}
		else {
			res.json(results);
		}
	});
	next();
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