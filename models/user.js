"use strict";

module.exports = function(sequelize, DataTypes) {
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

	User.associate = function(models) {
		User.belongsToMany(models.printer, {through : "user_printer" });
		User.hasOne(models.claim);
        }

        return User;
};

