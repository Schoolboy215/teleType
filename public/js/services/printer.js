angular.module('TeleTypeApp')
	.factory('printerLoader', ['$q','$http', function($q,$http) {
		this.loadPrinters = function(){
			return $q.all([
				$http.get('/api/printers/unclaimed'),
				$http.get('/api/printers/belongToUser')
			]).then(function(results) {
				return {'unclaimed':results[0]['data'],'yours':results[1]['data']};
			});
		}
		return this;
	}]);
