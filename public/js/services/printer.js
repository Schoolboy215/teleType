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

		this.getShareLink = function(id) {
			return $q.all([
				$http.post('/api/printers/'+id+'/getShareLink')
			]).then(function(results) {
				return results[0]['data'];
			});
		}

		this.startClaim = function(id) {
			return $q.all([
				$http.post('/api/printers/'+id+'/startClaim')
			]).then(function(results) {
				return;
			});
		}
		return this;
	}]);
