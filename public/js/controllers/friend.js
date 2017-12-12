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
		$scope.sendMessage = function(id) {
			var messagePrompt = $mdDialog.prompt()
				.title('What do you want to send?')
				.textContent('Type your message below')
				.placeholder('Message')
				.ariaLabel('message input')
				.ok('Send')
				.cancel('Cancel');

			$mdDialog.show(messagePrompt).then(function(result) {
				$http.post('/api/messages/send',{'user':id, 'message': result}).then(response => {
					$mdToast.show(
						$mdToast.simple()
						.textContent(response['data'])
						.position("top right")
						.hideDelay(2000)
					);
				});
			}, function() {
				$mdToast.show(
					$mdToast.simple()
					.textContent("Not sent")
					.position("top right")
					.hideDelay(2000)
				);
			});
		}
	}]).controller('fabCtrl', function($scope,$timeout) {
		var self = this;
		self.isOpen = false;
		self.tooltipVisible = false;

		$scope.$watch('fab.isOpen', function(isOpen) {
			if (isOpen) {
				$timeout(function() {
					self.tooltipVisible = self.isOpen;
				}, 600);
			} else {
				self.tooltipVisible = self.isOpen;
			}
		});
	});
