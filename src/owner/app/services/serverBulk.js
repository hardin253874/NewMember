(function () {
    'use strict';

    var myApp = angular.module('app');

    myApp.service('serverBulk', ['$rootScope', '$http', '$timeout', bulkServerService]);

    function bulkServerService ($rootScope, $http, $timeout) {
        var service = this;
        service.post = bulkPostAsyncFn;

        function bulkPostAsyncFn(url, payload, itemCompletedCallback, allCompletedCallback) {

            $http.post(url, payload)
                .error(errorHandle)
                .success(function (response) {
                    $rootScope.$broadcast('server:posted');

                    if (response.ResponseStatus && response.ResponseStatus.ErrorCode === 'posted') {
                        pollPostingStatus(response.TrackingIds, itemCompletedCallback, allCompletedCallback);
                    } else {
                        completed(allCompletedCallback, response);
                    }
                });
        }

        function pollPostingStatus(trackingIds, itemCompletedCallback, allCompletedCallback) {
            var pollUrl = "/api/financial/postingStatus/bulk";

            $http
                .post(pollUrl, { TrackingIds: trackingIds })
                .success(function (body) {
                    var remainingTrackingIds = body.TrackingIds;

                    body.BulkResponses.forEach(function (response) {
                        if (response.ResponseStatus.ErrorCode !== 'posted') {
                            itemCompletedCallback(response);
                        }
                    });
                    if (remainingTrackingIds && remainingTrackingIds.length > 0) {
                        $timeout(function () {
                            pollPostingStatus(remainingTrackingIds, itemCompletedCallback, allCompletedCallback);
                        }, 1000);
                    } else {
                        completed(allCompletedCallback, body);
                    }
                })
                .error(function (response, status) {
                    if (status === 401) {
                      window.location = "/sign-in";
                    }
                });
        }

        function completed(allCompletedCallback, response) {
            allCompletedCallback(response);
        }

        function errorHandle(data, status) {
            if (status === 401) {
              window.location = "/sign-in";
            }
        }
    }
}());
