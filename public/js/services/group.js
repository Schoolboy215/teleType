angular.module('TeleTypeApp')
	.factory('groupService', ['$q','$http', function($q,$http) {
        this.getGroups = function(){
            return $http.get('/api/groups').then(function(data,status) {
                return data;
            });
        }
        this.createGroup = function(name){
            return $http.post('api/groups/create',{name:name}).then(function(data,status) {
                return data;
            });
        }
        this.leaveGroup = function(id) {
            return $http.post('api/groups/leave',{groupId:id}).then(function(data,status) {
                return data;
            })
        }
        this.sendMessage = function(_groupId,_message) {
            return $http.post('api/groups/message',{groupId:_groupId,message:_message}).then(function(data,status) {
                return data;
            });
        }
        this.getUsersInGroup = function(_id){
            return $http.get('/api/groups/'+_id+'/users').then(function(data,status) {
                return data.data;
            });
        }
        this.addUsersToGroup = function(_groupId, _userArray){
            return $http.post('/api/groups/'+_groupId+'/users',{userArray:_userArray}).then(function(data,status) {
                return data.data;
            });
        }
        return this;
    }]);