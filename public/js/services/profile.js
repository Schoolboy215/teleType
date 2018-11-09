angular.module('TeleTypeApp')
	.factory('profileService', ['$q','$http', function($q,$http) {
        this.loadProfile = function(){
            return $http.get('/api/getProfile').then(function(data,status) {
                return data;
            });
        }
        this.setName = function(name){
            return $http.post('/api/profile/setName',{'name':name}).then(function(data,status) {
                return data;
            });
        }
        this.logout = function(){
            return $http.get('/logout').then(function(data,status) {
                return data;
            });
        }
        return this;
    }]);