"use strict";

module.exports = function(sequelize, DataTypes) {
        var User = sequelize.define("user", {
                googleId:	DataTypes.STRING,
		name:		DataTypes.STRING
        });

	User.associate = function(models) {
		User.belongsToMany(models.printer, {through : "user_printer" });
		User.hasOne(models.claim);
        }

        return User;
};

