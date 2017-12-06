module.exports = function(app, passport) {
	app.get('/login', passport.authenticate('google', {scope: 'profile'}));
	app.get('/login/callback',
        	passport.authenticate('google', {	failureRedirect: '/login',
                                         		successRedirect: '/'})
	);

	app.get('/login/getUser', function(req,res) {
		return res.send(req.user);		
	});
};
