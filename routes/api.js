var models = require('../models');
var express = require('express');
var circularJSON = require('circular-json');
var router = express.Router();

var printerController = require('../controllers/printer');

router.get('/api', function(req,res) {
	if (req.user)
		res.send(req.user);
	else
		res.send("no user");
	//res.send(circularJSON.stringify(req));
});
router.all('/api/firstContact', function(req,res) {
	printerController.firstContact(req,res);
});
router.get('/api/printerCheckIn', function(req,res) {
	printerController.getToken(req,res);
});
router.post('/api/getMessages', function(req,res) {
	printerController.checkMessages(req,res);
});

//BEGINNING OF FRONTEND
router.get('/api/printers/unclaimed', function(req,res) {
	printerController.unclaimed(req,res);
});
router.get('/api/printers/belongToUser', function(req,res) {
	printerController.belongToUser(req,res);
});
router.post('/api/printers/:id/getShareLink', function(req,res) {
	printerController.getShareLink(req,res);
});
router.post('/api/printers/:id/startClaim', function(req,res) {
	printerController.startClaim(req,res);
});
router.post('/api/printers/:id/attemptClaim', function(req,res) {
	printerController.attemptClaim(req,res);
});

module.exports = router;
