var app = angular.module('TeleTypeApp', ['ngRoute','ngMaterial']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/home.html'
		})
		.when('/printers', {
			templateUrl: 'views/printer.html'
		})
		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'loginCtrl'
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
}]);
