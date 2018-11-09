const {google} = require('googleapis');
const https = require("https");
var config = require('../config')('production');
var models = require('../models');

const oauth2Client = new google.auth.OAuth2(
  config.googleClientId,
  config.googleClientSecret,
  config.callbackURL
);

// generate a url that asks permissions for Google+ and Google Calendar scopes
const scopes = [
  'profile'
];

module.exports = function(app) {
	app.get('/login',
		function(req,res) {
			const url = oauth2Client.generateAuthUrl({
				scope: scopes
			});
			res.redirect(url);
		}
	);
	app.get('/login/callback',
			function(req,res) {
				oauth2Client.getToken(req.query.code, (err,tokens) => {
					oauth2Client.setCredentials(tokens);
					var gmail = google.gmail({
						auth: oauth2Client,
						version: 'v1'
					});
					google.oauth2('v2').userinfo.get({
						auth: oauth2Client,
					}, (err, data) => {
						models.user.findOne({where:{ 'googleId' : data.data.id }}).then(function(user) {
							if (user) {
								req.session.user = user;
								res.redirect('/');
							} else {
								var newUser = new models.user();
								newUser.googleId = data.data.id;
								newUser.name = data.data.name;
								newUser.save().then(function(err) {
									req.session.user = newUser;
									res.redirect('/');
								});
							}
						});
					});
				});
			}
	);

	app.get('/login/getUser', function(req,res) {
		return res.send(req.session.user);		
	});

	app.get('/logout', function(req,res) {
		if (req.session) {
			req.session.destroy(function(err) {
				res.send("Logged out");
			});
		}
	});
};
