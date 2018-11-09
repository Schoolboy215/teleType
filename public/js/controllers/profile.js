angular.module('TeleTypeApp')
	.controller('profileController', ['$scope','$window','$http','$animate','$mdDialog','$mdMedia','$mdToast','profileService',function($scope,$window,$http,$animate,$mdDialog,$mdMedia,$mdToast, profileService) {
        $scope.user = null;
        $scope.loadProfile = function() {
            profileService.loadProfile().then(result => {
                $scope.user = result.data;
            });
        }
        $scope.setName = function() {
            var confirm = $mdDialog.prompt()
                .title('What do you want your name to be?')
                .placeholder($scope.user.name)
                .ok('Set')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function(nameInput) {
                profileService.setName(nameInput).then(result => {
                    $scope.user.name = nameInput;
                });
            }, function() {
            });
        }
        $scope.logout = function() {
            profileService.logout().then(result => {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(result.data)
                    .position("top right")
                    .hideDelay(3000)
                );
                $window.location.href="/#";
            });
        }
        $scope.loadProfile();
	}]);