(function () {
    'use strict';

    angular.module('eliteApp').factory('eliteApi', ['$http', '$q', '$ionicLoading', eliteApi]);

    function eliteApi($http, $q, $ionicLoading) {

        var currentLeagueId;

        function doGet(url) {
            var deferred = $q.defer();

            $ionicLoading.show({template: 'Loading...'})
            $http.get(url)
                .success(function (data) {
                    console.log("Received data via HTTP");
                    $ionicLoading.hide();
                    deferred.resolve(data);
                })
                .error(function () {
                    console.log("Error while making HTTP call.");
                    $ionicLoading.hide();
                    deferred.reject();
                });
            return deferred.promise;
        }

        function getLeagues() {
            return doGet('http://elite-schedule.net/api/leaguedata');
        }

        function setLeagueId(leagueId) {
            currentLeagueId = leagueId;
        }

        function getLeagueData() {
            return doGet("http://elite-schedule.net/api/leaguedata/" + currentLeagueId);
        }

        return {
            getLeagues: getLeagues,
            getLeagueData: getLeagueData,
            setLeagueId: setLeagueId
        };
    }
}());