var models = require('../models');
var express = require('express');
var router = express.Router();

router.get('/dashboard', function(req,res) {
	res.sendFile("index.html", {root: './public/'});
});

module.exports = router;
