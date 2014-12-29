(function () {
    'use strict';

    angular.module('eliteApp').controller('VibrationCtrl', ['$cordovaVibration', VibrationCtrl]);

    function VibrationCtrl($cordovaVibration) {
        var vm = this;

        vm.vibrate = function () {
            $cordovaVibration.vibrate(500);
        };
    };
})();