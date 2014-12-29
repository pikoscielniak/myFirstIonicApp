(function () {
    'use strict';

    angular.module('eliteApp').factory('eliteApi', ['$http', '$q', '$ionicLoading', 'DSCacheFactory', eliteApi]);

    function eliteApi($http, $q, $ionicLoading, DSCacheFactory) {

        var currentLeagueId;


        self.leaguesCache = DSCacheFactory.get("leaguesCache");
        self.leagueDataCache = DSCacheFactory.get("leagueDataCache");

        function doGet(url, getDataFromCache, setDataInCache) {
            var deferred = $q.defer();

            var dataFromCache = getDataFromCache ? getDataFromCache() : null;

            if (dataFromCache) {
                console.log("Found data inside cache", dataFromCache);
                deferred.resolve(dataFromCache);
            } else {
                $ionicLoading.show({template: 'Loading...'})
                $http.get(url)
                    .success(function (data) {
                        console.log("Received data via HTTP");
                        $ionicLoading.hide();
                        if (setDataInCache) {
                            setDataInCache(data);
                        }
                        deferred.resolve(data);
                    })
                    .error(function () {
                        console.log("Error while making HTTP call.");
                        $ionicLoading.hide();
                        deferred.reject();
                    });
            }
            return deferred.promise;
        }

        function getLeaguesFromCache() {
            return self.leaguesCache.get('leagues');
        }

        function setLeaguesInCache(data) {
            self.leaguesCache.put('leagues', data);
        }

        function getLeagues() {
            return doGet('http://elite-schedule.net/api/leaguedata', getLeaguesFromCache, setLeaguesInCache);
        }

        function setLeagueId(leagueId) {
            currentLeagueId = leagueId;
        }

        function getLeagueDataFromCache() {
            return self.leagueDataCache.get("leagueData-" + currentLeagueId);
        }

        function setLeagueDataInCache(data) {
            return self.leagueDataCache.put("leagueData-" + currentLeagueId, data);
        }

        function getLeagueData() {
            return doGet("http://elite-schedule.net/api/leaguedata/" + currentLeagueId,
                getLeagueDataFromCache, setLeagueDataInCache);
        }

        return {
            getLeagues: getLeagues,
            getLeagueData: getLeagueData,
            setLeagueId: setLeagueId
        };
    }
}());