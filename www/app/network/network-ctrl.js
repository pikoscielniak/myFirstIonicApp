(function () {
    'use strict';

    angular.module('eliteApp').controller('NetworkCtrl', ['$cordovaNetwork', NetworkCtrl]);

    function NetworkCtrl($cordovaNetwork) {
        var vm = this;

        vm.isOnline = $cordovaNetwork.isOnline();

        vm.isOffline = $cordovaNetwork.isOffline();

    };
})();