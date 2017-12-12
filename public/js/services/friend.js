angular.module('TeleTypeApp')
	.factory('friendService', ['$q','$http', function($q,$http) {
		this.loadFriends = function(){
			return $q.all([
				$http.get('/api/users/getFriends')
			]).then(function(results) {
				return results[0]['data'];
			});
		}

		this.getInviteLink = function(){
			return $q.all([
				$http.get('/api/users/getInviteLink')
			]).then(function(results) {
				console.log("service done");
				return results[0]['data'];
			});
		}

		return this;
	}]);
