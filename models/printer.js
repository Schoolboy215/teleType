"use strict";
module.exports = function(sequelize, DataTypes) {
	var UserPrinter = sequelize.define('user_printer', {
});
	var Printer = sequelize.define("printer", {
		callsign: DataTypes.STRING,
		key: DataTypes.STRING,
		claimed: DataTypes.BOOLEAN
	});

	Printer.prototype.sendMessage = function(models,_message) {
		models.message.create({body:_message}).then(message => {
			this.addMessage(message);
		})
	};

	Printer.prototype.startClaim = function(models, _userId) {
		var generatedCode = Math.floor(1000+Math.random()*9000);
		models.claim.create({userId:_userId, code:generatedCode, validated:false}).then(claim => {
			this.setClaim(claim);
			this.sendMessage(models,"Your code is "+generatedCode);
		})
	};
	
	Printer.attemptClaim = function(models, _printer, _code) {
		return new Promise(function (resolve,reject) {
			_printer.getClaim().then(claim => {
				if (claim.code == _code)
					resolve(true);
				else
					resolve(false);
			});
		});
	};

	Printer.getShareLink = function(models, _callSign) {
		return new Promise(function (resolve,reject) {
			models.printer.findOne({where : {callsign : _callSign}}).then(printer => {
				var generatedCode = Math.floor(10000+Math.random()*50000); 
				models.share.create({code:generatedCode, claimed:false}).then(share => {
					share.setPrinter(printer);
					resolve(generatedCode);                        		
	                	});
			});
		});
	}

	Printer.associate = function(models) {
		Printer.belongsToMany(models.user, {through:UserPrinter});
		Printer.hasOne(models.token);
		Printer.hasOne(models.claim);
		Printer.hasMany(models.message);
	}

	return Printer;
};
