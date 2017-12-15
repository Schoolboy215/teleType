angular.module('TeleTypeApp')
	.controller('friendController', ['$scope','$http','$animate','$mdDialog','$mdMedia','$mdToast','friendService',function($scope,$http,$animate,$mdDialog,$mdMedia,$mdToast,friendService) {
		$scope.friends = [];
		$scope.loading = false;

		$scope.startLoad = function() {$scope.loading = true;$("document.body").css("opacity", 0.2);}
		$scope.stopLoad = function() {$scope.loading = false;$("document.body").css("opacity", 1);}

		$scope.loadFriends = function() {
			$scope.startLoad();
			friendService.loadFriends().then( result => {
				$scope.friends = result;
				$scope.stopLoad();
			});
		}

		$scope.loadFriends();

		$scope.getInviteCode = function() {
			$scope.startLoad();
			friendService.getInviteCode().then(result => {
				$scope.stopLoad();
				$mdDialog.show(
					$mdDialog.alert()
					.title('Have your friend use this code on their friends page')
					.htmlContent("<h3>This will add you guys to each other's friends lists</h3><p>"+result+"</p>")
					.ok('Got it')
				);
			});
		}

		$scope.useInviteCode = function() {
			var codePrompt = $mdDialog.prompt()
				.title("Use someone else's invite code")
				.textContent("This will add you both to each other's friend lists")
				.placeholder('00000')
				.ariaLabel('code input')
				.ok('Use')
				.cancel('Cancel');
			$mdDialog.show(codePrompt).then(function(code) {
				$scope.startLoad();
				friendService.useInviteCode(code).then(result => {
					$scope.stopLoad();
					$mdToast.show(
						$mdToast.simple().textContent(result['data']).position("top right").hideDelay(2000)
					);
					$scope.loadFriends();
				},error => {
					$mdToast.show(
						$mdToast.simple().textContent(error['data']).position("top right").hideDelay(2000)
					);
				});
			}, function() {
			});
		}

		$scope.removeFriend = function(id,name) {
			var confirmRemove = $mdDialog.confirm()
				.title("Are you sure you want to remove "+name+" from your friends?")
				.textContent("This will also remove you from their friends")
				.ariaLabel('Remove confirmation')
				.ok('Yes')
				.cancel('No');
			$mdDialog.show(confirmRemove).then(function() {
				$scope.startLoad();
				friendService.removeFriend(id).then(result => {
					$scope.stopLoad();
					$mdToast.show(
						$mdToast.simple()
						.textContent(result['data'])
						.position("top right")
						.hideDelay(2000)
					);
					$scope.loadFriends();
				});
			}, function() {}
			);
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
				$scope.startLoad();
				$http.post('/api/messages/send',{'user':id, 'message': result}).then(response => {
					$scope.stopLoad();
					$mdToast.show(
						$mdToast.simple()
						.textContent(response['data'])
						.position("top right")
						.hideDelay(2000)
					);
				});
			}, function() {
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
