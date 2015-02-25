(function() {

	angular.module('app').controller('DinnersController', ['DinnerService', DinnersController]);

	function DinnersController(dinnerService) {
		var vm = this;
        
        dinnerService.getMyDinners().then(
                function (dinners) {
                    vm.dinners = dinners;
                });

        return vm;
	}


})();