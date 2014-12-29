(function () {
    'use strict';

    angular.module('eliteApp').controller('LocationMapCtrl', ['$stateParams', 'eliteApi', LocationMapCtrl]);

    function LocationMapCtrl($stateParams, eliteApi) {
        var vm = this;

        vm.locationId = Number($stateParams.id);

        vm.map = {
            center: {
                latitude: 38.897677,
                longitude: -77.036530
            },
            zoom: 12
        };
        vm.marker = {};

        eliteApi.getLeagueData().then(getLeagueDataSuccess);

        function getLeagueDataSuccess(data) {
            vm.location = _.find(data.locations, {id: vm.locationId});
            console.dir(vm.location)
            vm.marker = {
                options: {
                    labelContent: vm.location.name + "<br />(Tap for directions)",
                    labelClass: 'marker-labels'
                },
                id: vm.location.id,
                coords: {
                    latitude: vm.location.latitude,
                    longitude: vm.location.longitude
                },
                showWindow: true
            };

            vm.map.center.latitude = vm.location.latitude;
            vm.map.center.longitude = vm.location.longitude;
        }

        vm.locationClicked = function (marker) {
            window.location = "geo:" + marker.coords.latitude + ',' + marker.coords.longitude + ";u=35";
        };
    };
})();