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
					res.send(req.headers.host+"/api/users/redeemShare/"+response);
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
	var code = crypto.randomBytes(9).toString('hex');
	var responseForPrinter = {};

	responseForPrinter['code'] = code;
	responseForPrinter['callsign'] = callsign;

	models.printer.create({callsign:callsign, code:code, claimed:false});
	res.send(JSON.stringify(responseForPrinter));
    },

    checkMessages: function(req, res) {
	console.log(req.body)
	models.printer.findOne({where : {callsign: req.body['callsign']}}).then(function(remotePrinter) {
		var responseForPrinter = {}
		if (!remotePrinter)
		{
			console.log('no printer found');
			responseForPrinter['status'] = 2;
			responseForPrinter['humanReadable'] = "Callsign not recognized/code not correct";
			responseForPrinter['data'] = {};
			res.send(JSON.stringify(responseForPrinter));
			return;
		}
		
		if (remotePrinter.code != req.body['code'] || !req.body['code'])
		{
			console.log('bad code. was looking for '+remotePrinter.code);
			responseForPrinter['status'] = 2;
                        responseForPrinter['humanReadable'] = "Callsign not recognized/code not correct";
                        responseForPrinter['data'] = {};
                        res.send(JSON.stringify(responseForPrinter));
                        return;
		}
		
		remotePrinter.getMessages().then(messages=>{
			if (messages.length){
				responseForPrinter['status'] = 1;
				responseForPrinter['humanReadable'] = messages.length+ " new messages";
				responseForPrinter['data'] = {};
                                responseForPrinter['data']['messages'] = [];
				for (var i = 0; i < messages.length; i++) {
					var m = messages[i];
					var toAdd = {};
					toAdd['body'] = m.body;
					toAdd['timestamp'] = m.timestamp;
					toAdd['from'] = m.from;
					toAdd['to'] = m.to;
					responseForPrinter['data']['messages'].push(toAdd);
				}
			}
			else {
				responseForPrinter['status'] = 0;
				responseForPrinter['humanReadable'] = "No new messages";
				responseForPrinter['data'] = {'messages':[]};
			}
			res.send(JSON.stringify(responseForPrinter));
		});
	})
    }
}

