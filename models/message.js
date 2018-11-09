"use strict";
var crypto = require("crypto");
const sharp = require('sharp');

module.exports = function(sequelize, DataTypes) {
	var Message = sequelize.define("message", {
		body:		DataTypes.STRING(512),
		from:		DataTypes.STRING(64),
		to:			DataTypes.STRING(64),
		timestamp:	{type: DataTypes.STRING(19), defaultValue: sequelize.literal("(datetime(CURRENT_TIMESTAMP,'localtime'))")},
		type:		DataTypes.STRING(8),
		imageData:	DataTypes.BLOB
	});

	Message.sendToUser = function(_fromUser, _toUser, _body, _imageData) {
		return new Promise(function (resolve,reject) {
			Message.create({body:_body, from: _fromUser.name, to: _toUser.name, imageData: _imageData}).then(m => {
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
		
	Message.processBeforeSending = function(_message) {
		return new Promise(function(resolve,reject) {
			var format = "";
			var base64Data = null;
			var filename = "";
			if (_message.imageData.indexOf("image/png") > -1)
			{
				base64Data = _message.imageData.replace(/^data:image\/png;base64,/, "");
				format = "png";
			}
			else if (_message.imageData.indexOf("image/jpeg") > -1)
			{
				base64Data = _message.imageData.replace(/^data:image\/jpeg;base64,/, "");
				format = "jpeg";
			}
			if (format != "")
			{
				filename = crypto.randomBytes(3).toString('hex') + "." + format;
				require("fs").writeFile("uploadedImages/"+filename, base64Data, 'base64', function(err) {
					sharp.cache(false);
					sharp("uploadedImages/"+filename).rotate().resize(384,null).jpeg().toBuffer().then(buffer => {
						_message.imageData = buffer;
						require("fs").unlinkSync("uploadedImages/"+filename);
						resolve(_message);
						//models.message.sendToUser(fromUser, toUser, req.body.message.body, buffer).then(sent =>{	
						//	res.send("Message sent to " + toUser.name);
						//	require("fs").unlinkSync("uploadedImages/"+filename);
						//});
					});
				});
			}
			else
				resolve(_message);
		});
		
	}

	return Message;
};
