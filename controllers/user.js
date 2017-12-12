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
	redeemShare: function(req,res) {
		console.log("got an api request to redeem");
		console.log(req.originalUrl);
		models.user.findOne({where : {id:req.user.id}}).then(user => {
			if (user) {
				models.share.findOne({where : {code:req.params.code, claimed: false}}).then(share => {
					if (share){
						var response = user.redeemShare(share);
						share.update({claimed:true}).then(()=>{});
						console.log("re 1");
						res.redirect(req.headers.host+'#printers');
					}
					else {
						console.log("re 2");
						res.redirect(req.headers.host+'#printers');
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
		models.user.findOne({where : {id:req.user.id}}).then(user => {
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

	getInviteLink: function(req,res) {
		models.user.findOne({where : {id:req.user.id}}).then(user => {
			user.generateInvite(models).then(invite => {
				res.send(req.headers.host+"/api/users/redeemInvite/"+invite.code);
				user.setInvite(invite);
			});
		});
	},

	redeemInvite: function(req,res) {
		models.user.findOne({where:{id:req.user.id}}).then(user => {
			models.invite.findOne({where:{code:req.params.code, userId: {[Op.not]:null}}}).then(invite => {
				if (!invite){
					res.send("invalid/expired invite code");
					return;
				}
				invite.getUser().then(inviteUser => {
					user.getFriends().then(friends => {
						var names = [];
						for (var i=0; i<friends.length; i++)
							names.push(friends[i].id);
						if (names.indexOf(inviteUser.id) > -1) {
							res.redirect(req.headers.host+'#friends');
							return;
						} else {
							user.addFriend(inviteUser);
							inviteUser.addFriend(user);
							res.redirect(req.headers.host+'#friends');
							return;
						}
					});
				});
			})
		});
	}
	//END OF FRONTEND API
}
