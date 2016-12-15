var express = require("express");
var morgan = require('morgan');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var request = require('request');

var httpServer = require('http').createServer(app);
fs = require('fs');

app.use("/css", express.static(__dirname + '/css'));
app.use("/routes", express.static(__dirname + '/routes'));
app.use("/images", express.static(__dirname + '/images'));
app.use("/js", express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
require('./routes/routes.js').init(app);


console.log("listening on 8888");
app.listen(8888);
