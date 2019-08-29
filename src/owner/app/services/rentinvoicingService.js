(function () {
	'use strict';
	angular.module('app').service('rentInvoicingService', ['$rootScope', 'server', service]);

    // Singleton to keep the isProcessing status global
    function service ($rootScope, server) {
        var svc = this;

        svc.processRentInvoicing = processRentInvoicing;

        svc.isProcessing = false;

        return svc;

        function processRentInvoicing(url, callback) {
            if (!svc.isProcessing) {
                svc.isProcessing = true;
                broadcastToAyncStatus(svc.isProcessing);    // is processing

                server.post(url, {}).success(function (response) {
                        svc.isProcessing = false;
                        broadcastToAyncStatus(svc.isProcessing);

                        if (callback) {
                            callback(response);
                        }
                    }
                );
            }
        }

        function broadcastToAyncStatus(isProcessing) {
            var message = 'status:rent-invoicing';
            $rootScope.$broadcast(message, isProcessing);
        }
    }
}());