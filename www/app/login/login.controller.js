(function() {

	angular.module('app').controller('LoginController', ['$state', '$ionicPopup', 'DinnerService', LoginController]);

	function LoginController($state, $ionicPopup, dinnerService) {


        var vm = this;
        vm.doLogin = function () {

            var onSuccess = function () {
                $state.go('my-dinners');    
            };

            var onError = function () {
                $ionicPopup.alert({
                     title: 'Login failed :(',
                     template: 'Please try again.'
                   });
            };

            dinnerService.login(vm.username, vm.password)
                         .then(onSuccess, onError);
        }

	}

})();