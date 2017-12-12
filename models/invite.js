"use strict";

module.exports = function(sequelize, DataTypes) {
	var Invite = sequelize.define("invite", {
		code : DataTypes.SMALLINT
	});

	Invite.associate = function(models) {
		Invite.belongsTo(models.user);
        }

	return Invite;
};
