angular.module('TeleTypeApp')
	.factory('friendService', ['$q','$http', function($q,$http) {
		this.loadFriends = function(){
			return $q.all([
				$http.get('/api/users/getFriends')
			]).then(function(results) {
				return results[0]['data'];
			});
		}

		this.getInviteCode = function(){
			return $q.all([
				$http.get('/api/users/getInviteCode')
			]).then(function(results) {
				return results[0]['data'];
			});
		}

		this.useInviteCode = function(code) {
			return $http.post('/api/users/useInviteCode',{'code':code});
		}

		this.removeFriend = function(id) {
			return $http.post('/api/users/removeFriend',{'id':id});
		}

		return this;
	}]);
