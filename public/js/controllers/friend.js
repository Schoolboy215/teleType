angular.module('TeleTypeApp')
	.controller('friendController', ['$scope','$http','$animate','$mdDialog','$mdMedia','$mdToast','friendService',function($scope,$http,$animate,$mdDialog,$mdMedia,$mdToast,friendService) {
		$scope.friends = [];

		friendService.loadFriends().then( result => {
			$scope.friends = result;
		});

		$scope.getInviteLink = function() {
			friendService.getInviteLink().then(result => {
				$mdDialog.show(
					$mdDialog.alert()
					.title('Have your friend follow this link while they are logged in')
					.htmlContent("<h3>This will add you guys to each other's friends lists</h3><p>"+result+"</p>")
					.ok('Got it')
				);
			});
		}
	}]);
