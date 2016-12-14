var express = require("express");
var morgan = require('morgan');
var spotify = require('/Users/dsai96/Desktop/Mobile to Cloud/finalProj/controller/spotify.js');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var session = require('express-session');
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat' }));
var request = require('request');
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

var httpServer = require('http').createServer(app);
fs = require('fs');
app.use("/css", express.static(__dirname + '/css'));
app.use("/routes", express.static(__dirname + '/routes'));
app.use("/images", express.static(__dirname + '/images'));
app.use("/js", express.static(__dirname + '/js'));
// app.use("/views", __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
require('./routes/routes.js').init(app);


// var passport = require('passport');
// var SpotifyStrategy = require('/Users/dsai96/Desktop/Mobile to Cloud/finalProj/node_modules/passport-spotify/lib/passport-spotify/index.js').Strategy;
// client_id = '1731b6ace897418a8f6eba00b6ab7ad1'; // Your client id
// client_secret = '85bfc69acd274d86aaa4227fd181def7'; // Your secret
// redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
//
// passport.use(new SpotifyStrategy({
//     clientID: client_id,
//     clientSecret: client_secret,
//     callbackURL: "http://localhost:8888/auth/spotify/callback"
//   }, spotify.spotifyCalculations));

console.log("listening on 50000");
app.listen(50000);
