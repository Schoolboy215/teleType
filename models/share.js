"use strict";

module.exports = function(sequelize, DataTypes) {
	var Share = sequelize.define("share", {
		code : DataTypes.SMALLINT,
		claimed : DataTypes.BOOLEAN
	});

	Share.associate = function(models) {
		Share.belongsTo(models.printer);
        }

	return Share;
};
