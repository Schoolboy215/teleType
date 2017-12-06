'use strict';

// Requires
var	express = require('express'),
	mustacheExpress = require('mustache-express'),
	bodyParser = require('body-parser'),
	errorHandler = require('errorhandler'),
	session = require('express-session'),
	sqlite3 = require('sqlite3'),
	passport = require('passport');

// Load config
var config = require('./config')('local');
require('./config/passport')(passport,config);

// Initialize DB
var models = require('./models');

// Create App
var app = express();
app.use(bodyParser.json());
app.use(errorHandler());
app.use(session({
	secret:	config.secret,
	resave: false,
	saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());
app.engine('html', mustacheExpress());

// Serve Static Files
app.use(express.static('public'));

// Set up views directory
//app.set('view engine', 'html');
//app.set('views', './templates');

// Routing
var index = require('./routes/index');
var api = require('./routes/api');
//var dashboard = require('./routes/dashboard');
require('./routes/auth.js')(app,passport);

app.all('/api*', api);
app.all('/', index);

// Create the Server
models.sequelize.sync().then(function() {
	try
	{
		var server = app.listen(config.port, function () {
   			console.log("Teletype "+config.mode+" server listening on port " + config.port);
		});
	}
	catch(err) {
		console.log(err.message);
	}
});
