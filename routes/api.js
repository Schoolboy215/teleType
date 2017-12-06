var models = require('../models');
var express = require('express');
var circularJSON = require('circular-json');
var router = express.Router();

var printerController = require('../controllers/printer');
var userController = require('../controllers/user');

router.get('/api', function(req,res) {
	if (req.user)
		res.send(req.user);
	else
		res.send("no user");
	//res.send(circularJSON.stringify(req));
});

//BEGINNING OF REMOTE API
router.all('/api/firstContact', function(req,res) {
	printerController.firstContact(req,res);
});
router.get('/api/printerCheckIn', function(req,res) {
	printerController.getToken(req,res);
});
router.post('/api/getMessages', function(req,res) {
	printerController.checkMessages(req,res);
});

function ensureAuthenticated(req, res, next) {
	if (req.user)
		return next();
	req.session.returnTo = '#';//req.url;
	res.sendStatus(401); 
}

//BEGINNING OF FRONTEND
router.get('/api/curUser', function(req,res) {if (req.user) res.send(req.user.name);else res.send(false);});
router.get('/api/printers/unclaimed', ensureAuthenticated, function(req,res) {printerController.unclaimed(req,res);});
router.get('/api/printers/belongToUser', ensureAuthenticated, function(req,res) {printerController.belongToUser(req,res);});
router.post('/api/printers/:id/getShareLink', ensureAuthenticated, function(req,res) {printerController.getShareLink(req,res);});
router.post('/api/printers/:id/startClaim', ensureAuthenticated, function(req,res) {	printerController.startClaim(req,res);});
router.post('/api/printers/:id/attemptClaim', ensureAuthenticated, function(req,res) {printerController.attemptClaim(req,res);});

router.get('/api/users/redeemShare/:code', ensureAuthenticated, function(req,res) {userController.redeemShare(req,res);});

module.exports = router;
