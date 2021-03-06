"use strict";

var	fs			= require("fs"),
	path		= require("path"),
	Sequelize	= require("sequelize"),
	db			= {};

var	sequelize =	new Sequelize('mainDB', null, null, {
					logging: false,
					dialect: "sqlite",
					storage: "./data.sqlite"
				});
fs
	.readdirSync(__dirname)
	.filter(function(file) {
		return (file.indexOf(".") !== 0) && (file !== "index.js");
	})
	.forEach(function(file) {
		var model = sequelize.import(path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(function(modelName) {
	if ("associate" in db[modelName]) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

