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

/*
 * DEBUG
 */
app.get('/', function (req, res, next){
	/*pool.query('select ?', ["test query with placeholder"], function (error, results, fields){
		// results hold the result -- array of RowDataPacket; e.g. results[0].id, results[0].author
		// fields hold the result set metadata
		if (error) throw error;
		res.json(results);
	});*/
	pool.query('select * from event', function (error, results, fields){
		if (error) throw error;
		res.json(results);
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