var app = angular.module('TeleTypeApp', ['ngRoute','ngMaterial','ngSanitize','flow']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/home.html'
		})
		.when('/printers', {
			templateUrl: 'views/printer.html'
		})
		.when('/friends', {
			templateUrl: 'views/friend.html',
			controller: 'friendController'
		})
		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'loginCtrl'
		}).when('/profile', {
			templateUrl: 'views/profile.html'
		}).when('/groups', {
			templateUrl: 'views/groups.html'
		});
}).factory('authResponseInterceptor', ['$q', '$location', function($q,$location){
	return {
		response: function(response){
			return response || $q.when(response);
		},
		responseError: function(rejection) {
			if (rejection.status === 401) {
				window.location ='#/login';
			}
			return $q.reject(rejection);
		}
	}
}]).config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('authResponseInterceptor');
}]).config(function($mdThemingProvider) {
	$mdThemingProvider.theme('blue-grey')
		.primaryPalette('blue-grey')
		.accentPalette('amber');
	$mdThemingProvider.setDefaultTheme('blue-grey');
});
