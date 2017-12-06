"use strict";

module.exports = function(sequelize, DataTypes) {
	var Claim = sequelize.define("claim", {
		code: DataTypes.SMALLINT
	});

	Claim.associate = function(models) {
		Claim.belongsTo(models.printer);
		Claim.belongsTo(models.user);
        }

	return Claim;
};
