(function() {

    angular.module('app').factory('DinnerService', ['$http', '$q', DinnerService])


    function DinnerService ($http, $q) {

        return {

            login: function (username, password) {
                var request = {
                    method: 'POST',
                    url: 'http://www.nerddinner.com/Account/LogOn',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: 'UserName=' + username + '&Password=' + password + '&RememberMe=false'
                };

                return $http(request).then(function(response){
                    var deferred = $q.defer();

                    // this header is only present after we have logged in successfully
                    if (response.headers('x-xrds-location')) {
                        deferred.resolve();
                    }
                    else {
                        deferred.reject();
                    } 

                    return deferred.promise;   
                });
            },

            getMyDinners: function () {

                var parseDinners = function (response) {

                    var tmp = document.implementation.createHTMLDocument();
                    tmp.body.innerHTML = response.data;

                    var items = tmp.body.getElementsByClassName('upcomingdinners')[0].children;

                    var dinners = [];
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];

                        var dateText = item.getElementsByTagName('strong')[0].innerText;
                        dateText = dateText.replace(/\r?\n|\r/g,'').replace(/\t+/, ' ');

                        var dinner = {
                            Name: item.getElementsByTagName('a')[0].innerText,
                            Date: moment(dateText, 'YYYY-MMM-DDhh:mm A').toDate(),
                            Location: item.innerText.split('at')[1]
                        };

                        dinners.push(dinner);
                    }

                    return dinners;
                }


                return $http.get('http://www.nerddinner.com/Dinners/My')
                            .then(function(response){
                                return parseDinners(response);
                            });
            }
        }

    }
})();