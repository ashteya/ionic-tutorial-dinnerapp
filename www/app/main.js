(function () {

    var DinnerService = function ($http) {

        return {

            login: function (username, password) {
                var request = {
                    method: 'POST',
                    url: 'http://www.nerddinner.com/Account/LogOn',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'UserName=' + username + '&Password=' + password + '&RememberMe=true'
                };

                return $http(request);
            },

            getMyDinners: function () {

                var parseDinners = function (response) {

                    var tmp = document.implementation.createHTMLDocument();
                    tmp.body.innerHTML = response.data;

                    //var items = $(tmp.body.children).find('.upcomingdinners li');

                    var items = tmp.body.getElementsByClassName('upcomingdinners')[0].children;

                    var dinners = [];
                    for (var i = 0; i < items.length; i++) {
                        var dinner = {
                            Name: angular.element(items[i]).find('a')[0].innerText,
                            Date: angular.element(items[i]).find('strong')[0].innerText
                        };
                        dinners.push(dinner);
                    }

                    return dinners;
                }

                return $http.get('http://www.nerddinner.com/Dinners/My')
                            .then(parseDinners);
            }
        }
    };

    var LoginController = function ($state, DinnerService) {

        var vm = this;
        vm.doLogin = function () {

            var onSuccess = function (response) {
                $state.go('my-dinners');
            };

            var onError = function (response) {
            };

            DinnerService.login(vm.username, vm.password)
                         .then(onSuccess, onError);
        }

        return vm;

    };

    var DinnersController = function(DinnerService) {

        var vm = this;
        
        DinnerService.getMyDinners().then(
                function (response) {
                    vm.dinners = response;
                },
                function (response) {
                });

        return vm;
    };

    var app = angular.module('app');

    app.config(function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    });

    app.factory('DinnerService', ['$http', DinnerService]);
    app.controller('LoginController', ['$state', 'DinnerService', LoginController]);
    app.controller('DinnersController', ['DinnerService', DinnersController]);
})();

