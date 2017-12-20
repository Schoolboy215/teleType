var models = require('../models');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(passport,config) {
	passport.use(new GoogleStrategy({
        	clientID: config.googleClientId,
        	clientSecret: config.googleClientSecret,
        	callbackURL: 'http://teletype.personalspaceshow.lawyer/login/callback'
	},
        function(token, tokenSecret, profile, done) {
                process.nextTick(function() {
                        models.user.findOne({where:{ 'googleId' : profile.id }}).then(function(user) {
                                if (user) {
                                        return done(null,user);
                                } else {
                                        console.log("not found");
                                        var newUser = new models.user();
                                        newUser.googleId = profile.id;
					newUser.name = profile.displayName;
                                        newUser.save().then(function(err) {
                                                if (err)
                                                        throw err;
                                                return done(null, newUser);
                                        });
					return done(null,null);
                                }

                        });
                });
        })
);
passport.serializeUser(function(user, done) {
        done(null, user);
});
passport.deserializeUser(function(user, done) {
        done(null, user);
});
};
