(function () {
    'use strict';

    angular.module('eliteApp').controller('BarcodeScannerCtrl', ['$cordovaBarcodeScanner', BarcodeScannerCtrl]);

    function BarcodeScannerCtrl($cordovaBarcodeScanner) {
        var vm = this;

        vm.scan = function () {
            $cordovaBarcodeScanner.scan().then(function (imageData) {
                // Success! Barcode data is here
                vm.results = imageData;
            }, function (err) {
                // An error occured. Show a message to the user
                alert("Error scanning: " + err);
            });
        };

        vm.lookup = function () {
            window.open("http://www.upcindex.com/" + vm.results.text, "_system");
        };

        vm.reset = function () {
            vm.results = null;
        };
    };
})();