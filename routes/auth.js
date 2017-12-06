module.exports = function(app, passport) {
	app.get('/login',
		passport.authenticate('google', {scope: 'profile'}),
		function(req,res) {
			console.log("done?");
		}
	);
	app.get('/login/callback',
        	passport.authenticate('google'),
		function(req,res) {
			res.redirect(req.session.returnTo || '/#/login');
			//delete req.session.returnTo;
		}
	);

	app.get('/login/getUser', function(req,res) {
		return res.send(req.user);		
	});
};
