angular.module('TeleTypeApp')
	.controller('printerController', ['$scope','$http','$animate','$mdDialog','$mdMedia','$mdToast','printerLoader',function($scope,$http,$animate,$mdDialog,$mdMedia,$mdToast,printerLoader) {
		$scope.unclaimed = [];
		$scope.claimed = [];
		printerLoader.loadPrinters().then(results => {
			$scope.unclaimed = results['unclaimed'];
			$scope.claimed = results['yours'];
		});
		$scope.getShareLink = function(id) {
			$http.post('/api/printers/'+id+'/getShareLink').success(function(data,status) {
				$mdDialog.show(
					$mdDialog.alert()
					.title('Share this link with someone to let their messages go to your printer')
					.textContent(data)
					.ok('Got it')
				);
			})
		}
		$scope.startClaim = function(id) {
			$http.post('/api/printers/'+id+'/startClaim').success(function(data,status) {
				$scope.attemptClaim(id);
			})
		}
		$scope.attemptClaim = function(id) {
			var confirm = $mdDialog.prompt()
				.clickOutsideToClose(false)
				.title("We need to verify your ownership")
				.textContent("What code came up on the printer?")
				.placeholder("0000")
				.ariaLabel("CODE")
				.ok("Submit")
				.cancel("Cancel");
			$mdDialog.show(confirm).then(function(result) {
				$http.post('/api/printers/'+id+'/attemptClaim',{code:result}).success(function(data,status) {
					console.log(data);
					var toastText = "Your code was incorrect";
					if (data){
						var removeIndex = $scope.unclaimed.indexOf(id);
						$scope.unclaimed.splice(removeIndex,1);
						var toastText = "You successfully claimed printer "+id;
					}
					$mdToast.show(
						$mdToast.simple()
						.textContent(toastText)
						.position("top right")
						.hideDelay(3000)
					);
				})
			});
		}
	}]);
