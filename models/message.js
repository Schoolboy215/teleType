"use strict";

module.exports = function(sequelize, DataTypes) {
	var Message = sequelize.define("message", {
		body:		DataTypes.STRING(512),
		from:		DataTypes.STRING(64),
		to:		DataTypes.STRING(64),
		timestamp:	DataTypes.STRING(19)
	});

	Message.associate = function(models) {
                Message.belongsTo(models.printer);
        }

	return Message;
};
