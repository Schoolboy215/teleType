var _ = require("underscore");
var crypto = require("crypto");
var models  = require('../models');
var sequelize = require('sequelize');
const Op = sequelize.Op;
const sharp = require('sharp');

module.exports = {
	name: "message",
	extend: function(child) {
		return _.extend({}, this, child);
	},
	//START OF FRONTEND API
	sendMessage: function(req,res) {
		models.message.processBeforeSending(req.body.message).then(_message => {
			models.user.findOne({where:{id:req.session.user.id}}).then(fromUser => {
				models.user.findOne({where:{id:req.body.user}}).then(toUser => {
					if (!toUser){res.send("No such user");return;}
					fromUser.getFriends({where:{id:req.body.user}}).then(friend => {
						if (!friend.length){res.send("That user isn't your friend");return;}
						models.message.sendToUser(fromUser, toUser, _message.body, _message.imageData).then(sent =>{	
							res.send("Message sent to " + toUser.name);
						});
					});
				});
			});
		});
	}
	//END OF FRONTEND API
}
