var _ = require("underscore");
var crypto = require("crypto");
var models  = require('../models');

module.exports = {
	name: "user",
	extend: function(child) {
		return _.extend({}, this, child);
	},
	//START OF FRONTEND API
	redeemShare: function(req,res) {
		console.log("got an api request to redeem");
		console.log(req.originalUrl);
		models.user.findOne().then(user => {
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
	}
	//END OF FRONTEND API
}
