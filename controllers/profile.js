var models  = require('../models');
module.exports = {
	name: "profile",
	extend: function(child) {
		return _.extend({}, this, child);
    },
    setProfileName: function(req,res) {
        models.user.findOne({where : {id:req.session.user.id}}).then(user => {
			if (user) {
				models.user.setName(req.body.name,user).then(() => {
                    req.session.user = user;
                    res.sendStatus(200);
                })
			}
			else{
				res.send(500);
			}
		});
    }
	//END OF FRONTEND API
}