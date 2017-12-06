"use strict";

module.exports = function(sequelize, DataTypes) {
	var Message = sequelize.define("message", {
		body: DataTypes.STRING
	});

	Message.associate = function(models) {
                Message.belongsTo(models.printer);
        }

	return Message;
};
