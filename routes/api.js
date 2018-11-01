var models = require('../models');
var express = require('express');
var circularJSON = require('circular-json');
var router = express.Router();

var printerController = require('../controllers/printer');
var userController = require('../controllers/user');
var messageController = require('../controllers/message');

router.get('/api', function(req,res) {
	if (req.session.user)
		res.send(req.session.user);
	else
		res.send("no user");
	//res.send(circularJSON.stringify(req));
});

//BEGINNING OF REMOTE API
router.get('/api/remote/firstContact', function(req,res) {
	printerController.firstContact(req,res);
});
router.post('/api/remote/checkIn', function(req,res) {
	printerController.checkMessages(req,res);
});

//BEGINNING OF FRONTEND
function ensureAuthenticated(req, res, next) {
	if (req.session.user)
		return next();
	req.session.returnTo = '#';
	res.sendStatus(401); 
}

router.get('/api/curUser', function(req,res) {if (req.session.user) res.send(req.session.user.name);else res.send(false);});
router.get('/api/users/getFriends', ensureAuthenticated, function(req,res) {userController.getFriends(req,res);});
router.get('/api/users/getInviteCode', ensureAuthenticated, function(req,res) {userController.getInviteCode(req,res);});
router.post('/api/users/useInviteCode', ensureAuthenticated, function(req,res) {userController.redeemInvite(req,res);});
router.post('/api/users/removeFriend', ensureAuthenticated, function(req,res) {userController.removeFriend(req,res);});

router.get('/api/printers/unclaimed', ensureAuthenticated, function(req,res) {printerController.unclaimed(req,res);});
router.get('/api/printers/belongToUser', ensureAuthenticated, function(req,res) {printerController.belongToUser(req,res);});
router.get('/api/printers/:id/getShareCode', ensureAuthenticated, function(req,res) {printerController.getShareCode(req,res);});
router.post('/api/printers/:id/startClaim', ensureAuthenticated, function(req,res) {	printerController.startClaim(req,res);});
router.post('/api/printers/:id/attemptClaim', ensureAuthenticated, function(req,res) {printerController.attemptClaim(req,res);});
router.post('/api/printers/:id/sendUpdate', ensureAuthenticated, function(req,res) {printerController.sendUpdate(req,res);});

router.post('/api/users/redeemShare', ensureAuthenticated, function(req,res) {userController.redeemShare(req,res);});
router.get('/api/users/redeemInvite/:code', ensureAuthenticated, function(req,res) {userController.redeemInvite(req,res);});

router.post('/api/messages/send', ensureAuthenticated, function(req,res) {messageController.sendMessage(req,res);});

module.exports = router;
