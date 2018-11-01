"use strict";

module.exports = function(sequelize, DataTypes) {
	var Message = sequelize.define("message", {
		body:		DataTypes.STRING(512),
		from:		DataTypes.STRING(64),
		to:			DataTypes.STRING(64),
		timestamp:	{type: DataTypes.STRING(19), defaultValue: sequelize.literal("(datetime(CURRENT_TIMESTAMP,'localtime'))")},
		type:		DataTypes.STRING(8)
	});

	Message.sendToUser = function(_fromUser, _toUser, _body) {
		return new Promise(function (resolve,reject) {
			Message.create({body:_body, from: _fromUser.name, to: _toUser.name}).then(m => {
				_toUser.getPrinters().then(printers => {
					for (var i=0; i<printers.length; i++){
						printers[i].addMessage(m);
					}
					resolve(true);
				});
			});
		});
	}

	Message.associate = function(models) {
                Message.belongsTo(models.printer);
        }

	return Message;
};
