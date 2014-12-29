(function () {
    'use strict';

    angular.module('eliteApp').factory('eliteApi', ['$http', '$q', '$ionicLoading', 'DSCacheFactory', eliteApi]);

    function eliteApi($http, $q, $ionicLoading, DSCacheFactory) {

        var self = this;
        self.leaguesCache = DSCacheFactory.get("leaguesCache");
        self.leagueDataCache = DSCacheFactory.get("leagueDataCache");

        function getOnExpireCallback(getData, cache) {
            return function (key, value) {
                getData()
                    .then(function () {
                        console.log("Leagues Cache was automatically refreshed.", new Date());
                    }, function () {
                        console.log("Error getting data. Putting expired item back in the cache.", new Date());
                        cache.put(key, value);
                    });
            }
        }

        self.leaguesCache.setOptions({
            onExpire: getOnExpireCallback(getLeagues, self.leaguesCache)
        });

        self.leagueDataCache.setOptions({
            onExpire: getOnExpireCallback(getLeagueData, self.leagueDataCache)
        });

        self.staticCache = DSCacheFactory.get("staticCache");

        function setLeagueId(leagueId) {
            self.staticCache.put("currentLeagueId", leagueId);
        }

        function getLeagueId() {
            return self.staticCache.get("currentLeagueId");
        }

        function doGet(url, getDataFromCache, setDataInCache, showLoading) {
            var deferred = $q.defer();

            var dataFromCache = getDataFromCache ? getDataFromCache() : null;

            if (dataFromCache) {
                console.log("Found data inside cache", dataFromCache);
                deferred.resolve(dataFromCache);
            } else {
                if (showLoading) {
                    $ionicLoading.show({template: 'Loading...'});
                }
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

        var leaguesCacheKey = 'leagues';

        function getLeaguesFromCache() {
            return self.leaguesCache.get(leaguesCacheKey);
        }

        function setLeaguesInCache(data) {
            self.leaguesCache.put(leaguesCacheKey, data);
        }

        function getLeagues(showLoading) {
            return doGet('http://elite-schedule.net/api/leaguedata', getLeaguesFromCache, setLeaguesInCache, showLoading);
        }

        function getLeaguesWithLoading() {
            return getLeagues(true);
        }

        function getLeagueDataCacheKey() {
            return "leagueData-" + getLeagueId();
        }

        function getLeagueDataFromCache() {
            return self.leagueDataCache.get(getLeagueDataCacheKey());
        }

        function setLeagueDataInCache(data) {
            return self.leagueDataCache.put(getLeagueDataCacheKey(), data);
        }

        function getLeagueData(showLoading) {
            return doGet("http://elite-schedule.net/api/leaguedata/" + getLeagueId(),
                getLeagueDataFromCache, setLeagueDataInCache, showLoading);
        }

        function getLeagueDataWithLoading() {
            return getLeagueData(true);
        }

        return {
            getLeagues: getLeaguesWithLoading,
            getLeagueData: getLeagueDataWithLoading,
            setLeagueId: setLeagueId
        };
    }
}());