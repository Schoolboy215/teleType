angular.module('TeleTypeApp')
.controller('groupController', ['$scope','$window','$http','$animate','$mdDialog','$mdMedia','$mdToast','groupService','friendService',function($scope,$window,$http,$animate,$mdDialog,$mdMedia,$mdToast, groupService,friendService) {
    $scope.groups = null;
    $scope.getGroups = function() {
        groupService.getGroups().then(results => {
            $scope.groups = results.data;
        });
    }
    $scope.createGroup = function() {
        var confirm = $mdDialog.prompt()
            .title('What do you want to call the group?')
            .placeholder("GROUP NAME")
            .ok('Create')
            .cancel('Cancel');

        $mdDialog.show(confirm).then(function(nameInput) {
            groupService.createGroup(nameInput).then(result => {
                $scope.getGroups();
            });
        }, function() {
        });
    }
    $scope.sendMessage = function(groupId, name) {
        $scope.sendToName = name;
        $mdDialog.show({
            controller: DialogController,
            templateUrl: '../modals/composeMessage.html',
            flex: '66',
            clickOutsideToClose:true,
            scope: $scope.$new(),
            fullscreen: true // Only for -xs, -sm breakpoints.
        }).then(function(messageInput) {
            groupService.sendMessage(groupId, messageInput).then(result => {
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(result['data'])
                    .position("top right")
                    .hideDelay(2000)
                );
            });
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

    $scope.leaveGroup = function(groupId){
        groupService.leaveGroup(groupId).then(result => {
            $scope.getGroups();
            $mdToast.show(
                $mdToast.simple()
                .textContent(result['data'])
                .position("top right")
                .hideDelay(2000)
            );
        });
    }

    $scope.showGroupUsers = function(_groupId){
        groupService.getUsersInGroup(_groupId).then(users => {
            $scope.users = users;
            $mdDialog.show({
                scope: $scope,
                preserveScope: true,
                templateUrl: '../modals/viewGroupMembers.html',
                clickOutsideToClose:true,
                fullscreen:true
            }).then(function() {

            }, function() {
                $scope.users = null;
            });
        });
    }
    $scope.selectFriendsToAdd = function(_groupId){
        friendService.loadFriends().then(friends => {
            $scope.friends = friends;
            $scope.selected = [];
            $mdDialog.show({
                scope: $scope,
                preserveScope: true,
                templateUrl: '../modals/selectFriendsForGroup.html',
                clickOutsideToClose:true,
                fullscreen:true
            }).then(function(_selected) {
                groupService.addUsersToGroup(_groupId,_selected).then(result=>{
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(result)
                        .position("top right")
                        .hideDelay(2000)
                    );
                });
            }, function() {
            });
        });
    }
    //-->METHODS FOR THE MODAL TO USE
    $scope.cancel = function(){
        $mdDialog.cancel();
    }
    $scope.add = function(){
        $mdDialog.hide($scope.selected);
    }
    $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        }
        else {
            list.push(item);
        }
    };
    $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };
    $scope.isIndeterminate = function() {
        return ($scope.selected.length !== 0 &&
            $scope.selected.length !== $scope.friends.length);
    };
    $scope.isChecked = function() {
        return $scope.selected.length === $scope.friends.length;
    };
    $scope.toggleAll = function() {
        if ($scope.selected.length === $scope.friends.length) {
            $scope.selected = [];
        } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
            $scope.friends.forEach(f => {
                $scope.selected.push(f.id);
            });
        }
    };
    //<--METHODS FOR THE MODAL TO USE
    $scope.getGroups();
}]);