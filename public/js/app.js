var app = angular.module('TeleTypeApp', ['ngRoute','ngMaterial']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/printers', {
			templateUrl: 'views/printer.html'
		});
}).factory('authResponseInterceptor', ['$q', '$location', function($q,$location){
	return {
		response: function(response){
			return response || $q.when(response);
		},
		responseError: function(rejection) {
			if (rejection.status === 401) {
				console.log('401d');
				window.location ='/login';
			}
			return $q.reject(rejection);
		}
	}
}]).config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('authResponseInterceptor');
}]);
