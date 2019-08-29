(function () { 
    'use strict';

    angular.module('app').controller('notificationsController',
        ['$rootScope', '$scope','$timeout', 'config', 'notificationService', notifications]);

    function notifications($rootScope, $scope, $timeout,  config, notificationService) {
        var vm = this;

        vm.alerts = [];
        vm.disabled = false;
        vm.reload = function() {
            location.reload();
        };

        vm.isDisplayedBefore = false;
        vm.isSearching = false;

        vm.switchSearch = function() {
            if(!vm.isDisplayedBefore) {
                vm.isSearching = !vm.isSearching;
            }
        };

        vm.notificationService = notificationService;
        vm.clickAlerts = clickAlerts;

        vm.disconnected = false;
        vm.disconnectedRequireReload = false;
        vm.userSignedOut = false;
        var disconnectionTimer = null;

        init();

        return vm;

        // FUNCTIONS //

        function init() {
            vm.disabled = notificationService.disabled;

            $rootScope.$on(config.events.serverDisconnected, serverDisconnected);
            $rootScope.$on(config.events.serverReconnected, serverReconnected);
            $rootScope.$on(config.events.userSignedOut, userSignedOut);


            // reset isDisplayedBefore after a short time
            $scope.$watch('vm.isDisplayedBefore', function(){
                if(vm.isDisplayedBefore){
                    $timeout(function(){
                        vm.isDisplayedBefore = false;
                    },200);
                }
            });
        }

        function clickAlerts(){
            // only load it once, it's very expensive
            if(notificationService.waitingToLoadingAlerts) {
                notificationService.loadUnreadAlerts()
                    .then(notificationService.setRead);
            }else{
                notificationService.setRead();
            }
        }

        function serverDisconnected(scope, eventObj) {
            if (!disconnectionTimer) {
                vm.disconnected = true;

                $timeout(function () {
                    $scope.$apply();
                });

                disconnectionTimer = $timeout(function () {
                    disconnectionTimer = null;
                    vm.disconnectedRequireReload = true;
                }, 10000);
            }
        }

        function serverReconnected(scope, eventObj) {
            var needUpdate = vm.disconnected || vm.disconnectedRequireReload;

            if(needUpdate) {
                //console.log('Show as Connected');

                vm.disconnected = false;
                vm.disconnectedRequireReload = false;

                $timeout(function () {
                    $scope.$apply();
                });

                if (disconnectionTimer) {
                    $timeout.cancel(disconnectionTimer);
                    disconnectionTimer = null;
                }
            }
        }

        function userSignedOut(scope, eventObj) {
            vm.userSignedOut = true;
            $timeout(function () {
                $scope.$apply();
            });
        }
    }
})();