(function () {
    'use strict';

    angular.module('ngApp').controller('DialogsCtrl', ['$cordovaDialogs', DialogsCtrl]);

    function DialogsCtrl($cordovaDialogs) {
        var vm = this;

        vm.alert = function () {
            $cordovaDialogs.alert('Wow!', alertClosed, "Alert Title", "Dismiss");
        };

        function alertClosed(){
            $cordovaDialogs.alert("Alert was closed.");
        }

        vm.confirm = function () {
            $cordovaDialogs.confirm('Are you sure?', confirmClosed, "Confirmation", ["Yes", "No"]);
        };

        function confirmClosed(buttonIndex) {
            $cordovaDialogs.alert("Button selected: " + buttonIndex);
        }

        vm.prompt = function () {
            $cordovaDialogs.prompt('Please Login', promptClosed, "Login", ["Login", "Cancel"]);
        };

        function promptClosed(results) {
            alert("You selected button number " + results.buttonIndex + " and entered " + results.input1);
        }

        vm.beep = function () {
            // beep 3 times
            $cordovaDialogs.beep(3);
        };
       
    };
})();