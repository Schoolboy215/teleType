var _ = require("underscore");
var crypto = require("crypto");
var models  = require('../models');
var sequelize = require('sequelize');
const Op = sequelize.Op;

module.exports = {
	name: "user",
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
	},

	redeemShare: function(req,res) {
		console.log("got an api request to redeem");
		console.log(req.originalUrl);
		models.user.findOne({where : {id:req.session.user.id}}).then(user => {
			if (user) {
				models.share.findOne({where : {code:req.body.code, claimed: false}}).then(share => {
					if (share){
						var response = user.redeemShare(share);
						share.update({claimed:true}).then(()=>{});
						res.send("Share successful");
					}
					else {
						res.send("Invalid share code");
					}
				});
			}
			else{
				console.log("re 3");
				res.redirect('/login');
			}
		});
		console.log("Out of find");
	},

	getFriends: function(req,res) {
		models.user.findOne({where : {id:req.session.user.id}}).then(user => {
			user.getFriends().then(friends => {
				var toReturn = [];
				for (var i=0; i<friends.length; i++) {
					var building = {};
					building['id'] = friends[i].id;
					building['name'] = friends[i].name;
					toReturn.push(building);
				}
				res.send(toReturn);
				return;
			});
		});
		
	},

	getInviteCode: function(req,res) {
		models.user.findOne({where : {id:req.session.user.id}}).then(user => {
			user.generateInvite(models).then(invite => {
				res.send(String(invite.code));
				user.setInvite(invite);
			});
		});
	},

	redeemInvite: function(req,res) {
		models.user.findOne({where:{id:req.session.user.id}}).then(user => {
			models.invite.findOne({where:{code:req.body.code, userId: {[Op.not]:null}}}).then(invite => {
				if (!invite){
					res.status(400).send("invalid/expired invite code");
					return;
				}
				invite.getUser().then(inviteUser => {
					user.getFriends().then(friends => {
						var names = [];
						for (var i=0; i<friends.length; i++)
							names.push(friends[i].id);
						if (names.indexOf(inviteUser.id) > -1) {
							res.send("You're already friends");
							return;
						} else {
							user.addFriend(inviteUser);
							inviteUser.addFriend(user);
							res.send("You are now friends with " + inviteUser.name);
							return;
						}
					});
				});
			})
		});
	},

	removeFriend: function(req,res) {
		models.user.findOne({where:{id:req.session.user.id}}).then(user => {
			user.getFriends({where:{id:req.body.id}}).then(friends => {
				if (!friends.length){
					res.send("That user isn't in your friend list");
					return;
				}
				var friend = friends[0];
				user.removeFriend(friend);
				friend.removeFriend(user);
				res.send("You are no longer friends with "+friend.name);
				return;
			});
		})
	}
	//END OF FRONTEND API
}
