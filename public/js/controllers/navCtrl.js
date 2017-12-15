angular.module('TeleTypeApp')
	.controller('navCtrl', function($mdSidenav,$http) {
		this.curUser = false;
		$http.get('/api/curUser').then(result => {
			this.curUser = result['data'];
		});
		this.toggleLeft = function() {
			$mdSidenav('left').toggle();
		}
		this.closeLeft = function() {
			$mdSidenav('left').toggle();
		}
	});
