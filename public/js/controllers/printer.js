angular.module('TeleTypeApp')
	.controller('printerController', ['$scope','$http','$animate','$mdDialog','$mdMedia','$mdToast','printerLoader',function($scope,$http,$animate,$mdDialog,$mdMedia,$mdToast,printerLoader) {
		$scope.unclaimed = [];
		$scope.claimed = [];
		$scope.loadPrinters = function() {
			printerLoader.loadPrinters().then(results => {
				$scope.unclaimed = results['unclaimed'];
				$scope.claimed = results['yours'];
			});
		}
		$scope.getShareCode = function(id) {
			printerLoader.getShareCode(id).then(data => {
				$mdDialog.show(
					$mdDialog.alert()
					.title('Share this code with someone to let their messages go to your printer')
					.textContent(data)
					.ok('Got it')
				);
			});
		}
		$scope.useShareCode = function() {
			var codePrompt = $mdDialog.prompt()
				.title("Use someone else's printer share code")
				.textContent("This will mean both of your messages will print on the same printer")
				.placeholder('00000')
				.ariaLabel('code input')
				.ok('Use')
				.cancel('Cancel');
			$mdDialog.show(codePrompt).then(function(code) {
				printerLoader.useShareCode(code).then(result => {
					$mdToast.show(
						$mdToast.simple().textContent(result['data']).position("top right").hideDelay(2000)
					);
					$scope.loadPrinters();
				},error => {
					$mdToast.show(
						$mdToast.simple().textContent(error['data']).position("top right").hideDelay(2000)
					);
				});
			}, function() {
			});
		}
		$scope.startClaim = function(id) {
			printerLoader.startClaim(id).then(data =>{
				$scope.attemptClaim(id);
			});
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
		$scope.loadPrinters();
	}]);
