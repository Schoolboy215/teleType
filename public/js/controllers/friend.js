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

		$scope.sendMessage = function(id,name,ev) {
			$scope.sendToName = name;
			$mdDialog.show({
				controller: DialogController,
				templateUrl: '../modals/composeMessage.html',
				flex: '66',
				parent: angular.element(document.body),
				targetEvent: ev,
				scope: $scope.$new(),
				clickOutsideToClose:true,
				fullscreen: true // Only for -xs, -sm breakpoints.
			}).then(function(messageInput) {
				$http.post('api/users/message',{'user':id, 'message': messageInput}).then(response => {
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

		function DialogController($scope, $mdDialog) {
			$scope.messageInput = {
				body: "",
				imageData: ""
			};
			$scope.hide = function() {
			  $mdDialog.hide();
			};
		
			$scope.cancel = function() {
			  $mdDialog.cancel();
			};
		
			$scope.send = function() {
				$mdDialog.hide($scope.messageInput);
			};

			$scope.processFiles = function(file)
			{
				var base64;
				var fileReader = new FileReader();
						fileReader.onload = function (event) {
								$scope.messageInput.imageData = event.target.result;
						};
				fileReader.readAsDataURL(file.file);
			};
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
	}).directive("ngFileSelect", function(fileReader, $timeout) {
		return {
		  scope: {
			ngModel: '='
		  },
		  link: function($scope, el) {
			function getFile(file) {
			  fileReader.readAsDataUrl(file, $scope)
				.then(function(result) {
				  $timeout(function() {
					$scope.ngModel = result;
				  });
				});
			}
	
			el.bind("change", function(e) {
			  var file = (e.srcElement || e.target).files[0];
			  getFile(file);
			});
		  }
		};
	  }).factory("fileReader", function($q, $log) {
		var onLoad = function(reader, deferred, scope) {
		  return function() {
			scope.$apply(function() {
			  deferred.resolve(reader.result);
			});
		  };
		};
	  
		var onError = function(reader, deferred, scope) {
		  return function() {
			scope.$apply(function() {
			  deferred.reject(reader.result);
			});
		  };
		};
	  
		var onProgress = function(reader, scope) {
		  return function(event) {
			scope.$broadcast("fileProgress", {
			  total: event.total,
			  loaded: event.loaded
			});
		  };
		};
	  
		var getReader = function(deferred, scope) {
		  var reader = new FileReader();
		  reader.onload = onLoad(reader, deferred, scope);
		  reader.onerror = onError(reader, deferred, scope);
		  reader.onprogress = onProgress(reader, scope);
		  return reader;
		};
	  
		var readAsDataURL = function(file, scope) {
		  var deferred = $q.defer();
	  
		  var reader = getReader(deferred, scope);
		  reader.readAsDataURL(file);
	  
		  return deferred.promise;
		};
	  
		return {
		  readAsDataUrl: readAsDataURL
		};
	  });
