"use strict";

module.exports = function(sequelize, DataTypes) {

	var UserUser = sequelize.define('friends', {
});

        var User = sequelize.define("user", {
                googleId:	DataTypes.STRING,
		name:		DataTypes.STRING
        });

	User.prototype.redeemShare = function(_share) {
		_share.getPrinter().then(printer => {
			if (!printer.claimed)
				printer.update({claimed:true}).then(()=>{});
			this.addPrinter(printer).then(()=>{return;});
		});
	};

	User.prototype.generateInvite = function(models) {
		return new Promise(function (resolve,reject) {
			models.invite.create({code: Math.floor(10000+Math.random()*50000)}).then(invite => {
				resolve(invite);
			});
		});
	};

	User.associate = function(models) {
		User.belongsToMany(models.printer, {through: "user_printer" });
		User.belongsToMany(User, {as: 'Friends', through: "friends" });
		User.hasOne(models.claim);
		User.hasOne(models.invite);
        }

        return User;
};

