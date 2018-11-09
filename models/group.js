"use strict";

module.exports = function(sequelize, DataTypes) {
	var Group = sequelize.define("group", {
		name: DataTypes.STRING(24)
	});

	Group.associate = function(models) {
		Group.belongsToMany(models.user, {through: "user_group"});
    }

	return Group;
};