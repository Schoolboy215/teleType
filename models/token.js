"use strict";

module.exports = function(sequelize, DataTypes) {
        var Token = sequelize.define("token", {
                code: DataTypes.STRING
        });
	Token.associate = function(models) {
		Token.belongsTo(models.printer);
	}

        return Token;
};

