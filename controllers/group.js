var models  = require('../models');
module.exports = {
	name: "group",
	extend: function(child) {
		return _.extend({}, this, child);
    },
    getUserGroups: function(req,res) {
        models.user.findOne({where:{id:req.session.user.id}}).then(user => {
            user.getGroups().then(groups => {
                res.send(groups);
            });
        });
    },
    getUsersInGroup: function(req,res) {
        models.group.findOne({where:{id:req.params.id}}).then(group => {
            group.getUsers().then(users => {
                toReturn = [];
                validUser = false;
                users.forEach(u => {
                    if (u.id == req.session.user.id)
                        validUser = true;
                    toReturn.push(u.name);
                });
                if (validUser)
                    res.send(toReturn);
                else
                    res.sendStatus(403);
            });
        });
    },
    addUsersToGroup: function(req,res) {
        models.group.findOne({where:{id:req.params.id}}).then(group => {
            group.getUsers().then(usersInGroup => {
                var promises = [];
                req.body.userArray.forEach(userRequestId => {
                    var promise = models.user.findOne({where:{id:userRequestId}});
                    promises.push(promise);
                });
                Promise.all(promises).then(users =>{
                    users.forEach(u => {
                        if (!usersInGroup.includes(u))
                            group.addUser(u);
                    });
                    res.send("Those friends have been added if not already in group.");
                });
            });
        });
    },
    createGroup: function(req,res) {
        models.group.create({name:req.body.name}).then(result => {
            models.user.findOne({where:{id:req.session.user.id}}).then(user => {
                result.addUser(user);
                res.send("Done adding");
            });
        });
    },
    leaveGroup: function(req,res) {
        models.user.findOne({where:{id:req.session.user.id}}).then(user => {
            models.group.findOne({where:{id:req.body.groupId}}).then(group => {
                group.getUsers().then(usersInGroup => {
                    var validUser = false;
                    usersInGroup.forEach(u => {
                        if (u.id == user.id)
                            validUser = true;
                    });
                    if (validUser){
                        if (usersInGroup.length == 1)
                        {
                            group.removeUser(user).then(() => {
                                group.destroy();
                                res.send("You were the only user, so the group was also deleted");
                            });
                        }
                        else
                        {
                            group.removeUser(user).then(() => {
                                res.send("You left the group");
                            });
                        }
                    }
                    else{
                        res.sendStatus(403);
                    }
                });
            });
        });
    },
    sendMessage: function(req,res) {
        models.message.processBeforeSending(req.body.message).then(_message => {
            models.user.findOne({where:{id:req.session.user.id}}).then(fromUser => {
                models.group.findOne({where:{id:req.body.groupId}}).then(group => {
                    group.getUsers().then(usersInGroup => {
                        var userInGroup = false;
                        var promises = [];
                        var printersToMessage = [];
                        usersInGroup.forEach(u => {
                            if (u.id == req.session.user.id)
                                userInGroup = true;
                            var promise = u.getPrinters();
                            promises.push(promise);
                        });
        
                        if (!userInGroup)
                        {
                            res.sendStatus(403);    //User is trying to send to a groupId that they aren't a member of
                            return;
                        }
                        Promise.all(promises).then(arraysOfPrinters => {
                            arraysOfPrinters.forEach(currentArray => {
                                currentArray.forEach(printer => {
                                    if (!printersToMessage.includes(printer.id))
                                    {
                                        printer.sendGroupMessage(models,fromUser.name,group.name,_message);
                                        printersToMessage.push(printer.id);
                                    }
                                });
                            });
                            res.send("Message sent to " + group.name);
                        })
        
                    });
                });
            });
        });
    }
	//END OF FRONTEND API
}