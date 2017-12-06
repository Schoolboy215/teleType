var models = require('../models');
var express = require('express');
var router = express.Router();

router.get('/', function(req,res) {
	res.render('public/index', {
		title: 'Welcome to teleType'
	});
});

module.exports = router;
