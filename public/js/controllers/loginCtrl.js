angular.module('TeleTypeApp')
	.controller('loginCtrl', function($scope,$http,$window) {
		$scope.user = false;
		$http.get('/api/curUser').success(function(data,status) {
			$scope.user = data;
			console.log($scope.user);
		});

		$scope.googleLogin = function() {
			$window.location.href = '/login';
//				$http.get('/api/curUser').success(function(data,status) {
//					$scope.user = data;
//				});
		};
	});
