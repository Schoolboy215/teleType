var _ = require("underscore");
var crypto = require("crypto");
var models  = require('../models');

module.exports = {
    name: "printer",
    extend: function(child) {
        return _.extend({}, this, child);
    },
//START OF FRONTEND API
	unclaimed: function(req,res) {
		if (!req.user) {res.sendStatus(401);return;}
		models.printer.findAll({where :{claimed:false}}).then(printers => {
			var response = [];
			for (var i=0; i < printers.length; i++) {
				response.push(printers[i].callsign);
			}
			res.send(JSON.stringify(response));
		})
	},
	getShareLink: function(req,res) {
		if(!req.user) {res.sendStatus(401);return;}
		models.user.findOne({where : {id:req.user.id}}).then(user => {
			user.getPrinters({where :{callsign : req.params.id}}).then(printers => {
				if (!printers.length){res.send("Nice try, hacker");return;}
				models.printer.getShareLink(models,req.params.id).then(response => {
					res.send("http://teleType.personalspaceshow.lawyer:5000/printers/redeemShare/"+response);
				});
			});
		});
	},
	belongToUser: function(req,res) {
		if (!req.user) {res.sendStatus(401);return;}
		models.user.findOne({where : {id:req.user.id}}).then(user => {
			user.getPrinters().then(printers => {
				var response = [];
				for (var i=0; i<printers.length; i++) {
					response.push(printers[i].callsign);
				}
				res.send(JSON.stringify(response));
			});
		});
	},
	startClaim: function(req, res) {
		if (!req.user){res.sendStatus(401);return;}
		models.printer.findOne({where : {callsign: req.params.id}}).then(function(remotePrinter) {
			if (remotePrinter){
				remotePrinter.startClaim(models,req.user.id);
				res.sendStatus(200);
			}
			else {
				res.sendStatus(404);
			}
		})
	},
	attemptClaim: function(req,res) {
		if (!req.user){res.sendStatus(401);return;}
		models.printer.findOne({where: {callsign: req.params.id}}).then(function(remotePrinter) {
			if (remotePrinter){
				models.printer.attemptClaim(models,remotePrinter,req.body.code).then(modelResult => {
					if (modelResult){
						models.user.findOne({where :{id:req.user.id}}).then(user => {
							user.addPrinter(remotePrinter).then(result => {
								remotePrinter.update({claimed:true}).then(updated => {
									res.send(true);
								});
							});
						});
					}
					else{
						res.send(false);
					}
				})
			}
			else{res.sendStatus(404);}
		})
	},
	sendMessage: function(req, res) {
		res.sendStatus(200);	
	},
//START OF REMOTE API
    firstContact: function(req, res) {
	var callsign = crypto.randomBytes(3).toString('hex');
	var key = crypto.randomBytes(32).toString('hex');
	var responseForPrinter = {};

	responseForPrinter['key'] = key;
	responseForPrinter['callsign'] = callsign;

	models.printer.create({callsign:callsign, key:key, claimed:false});
	res.send(JSON.stringify(responseForPrinter));
    },

    getToken: function(req, res) {
	models.printer.findOne({where : {callsign: req.query.callsign}}).then(function(remotePrinter) {
		if (!remotePrinter)
		{
            		res.status(404).send("No such printer was found");
			return;
		}
		var t = models.token.build({code:crypto.randomBytes(4).toString('hex')});
		var cipher = crypto.createCipher('aes-256-ctr',remotePrinter.key);
		var responseForPrinter = {};

		var encrypted = cipher.update(t.code,'hex','hex');
		encrypted += cipher.final();
		responseForPrinter["code"] = encrypted;
		responseForPrinter["plain"] = t.code;
		responseForPrinter["key"] = remotePrinter.key;
		remotePrinter.setToken(t);
        	res.send(JSON.stringify(responseForPrinter));
	})
    },

    checkMessages: function(req, res) {
	models.printer.findOne({where : {callsign: req.params.callsign}}).then(function(remotePrinter) {
		if (!remotePrinter)
		{
			res.status(404).send("No such printer was found");
			return;
		}
		
		var t = remotePrinter.getToken();
		var responseForPrinter = {};

		if ((t.code + remotePrinter.callsign) == req.params.nonce)
		{
			responseForPrinter["status"] = "verified";
			responseForPrinter["messages"] = [];		
		}
		else
		{
			responseForPrinter["status"] = "not verified";
		}
		res.send(JSON.stringify(responseForPrinter));
	})
    }
}

