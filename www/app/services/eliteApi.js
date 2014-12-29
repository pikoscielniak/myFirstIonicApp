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

        function doGet(options) {
            var deferred = $q.defer();

            var tryGetFromCache = !options.forceRefresh;

            var dataFromCache = null;
            if (tryGetFromCache) {
                dataFromCache = options.getDataFromCache ? options.getDataFromCache() : null;
            }

            if (dataFromCache) {
                console.log("Found data inside cache", dataFromCache);
                deferred.resolve(dataFromCache);
            } else {
                if (options.showLoading) {
                    $ionicLoading.show({template: 'Loading...'});
                }
                $http.get(options.url)
                    .success(function (data) {
                        console.log("Received data via HTTP");
                        $ionicLoading.hide();
                        if (options.setDataInCache) {
                            options.setDataInCache(data);
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
            var options = {
                url: 'http://elite-schedule.net/api/leaguedata',
                getDataFromCache: getLeaguesFromCache,
                setDataInCache: setLeaguesInCache,
                showLoading: showLoading
            };
            return doGet(options);
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

        function getLeagueData(forceRefresh, showLoading) {
            var options = {
                url: "http://elite-schedule.net/api/leaguedata/" + getLeagueId(),
                getDataFromCache: getLeagueDataFromCache,
                setDataInCache: setLeagueDataInCache,
                forceRefresh: forceRefresh,
                showLoading: showLoading
            };
            return doGet(options);
        }

        function getLeagueDataWithLoading(forceRefresh) {
            return getLeagueData(forceRefresh, true);
        }

        return {
            getLeagues: getLeaguesWithLoading,
            getLeagueData: getLeagueDataWithLoading,
            setLeagueId: setLeagueId
        };
    }
}());