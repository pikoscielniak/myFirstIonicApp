(function () {
    'use strict';

    angular.module('eliteApp').controller('DeviceCtrl', ['$cordovaDevice', DeviceCtrl]);

    function DeviceCtrl($cordovaDevice) {
        var vm = this;

        vm.deviceModel = function() {
            vm.results = $cordovaDevice.getModel();
        };

        vm.devicePlatform = function () {
            vm.results = $cordovaDevice.getPlatform();
        };

        vm.deviceUUID = function(){
            vm.results = $cordovaDevice.getUUID();
        };

        vm.deviceVersion = function () {
            vm.results = $cordovaDevice.getVersion();
        };

        vm.cordovaVersion = function () {
            vm.results = $cordovaDevice.getCordova();
        };

        vm.device = function () {
            vm.results = $cordovaDevice.getDevice();
        };
    };
})();