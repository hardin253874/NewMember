(function () {
    'use strict';

    var myApp = angular.module('app');

    myApp.service('server', ['$rootScope', '$http', '$timeout', '$q', 'dtoFactory', 'FileUploader', 'pmCachingService', 'config',
        serverService]);

    function serverService ($rootScope, $http, $timeout, $q, dtoFactory, fileUploader, pmCachingService, config) {
        var server = this;

        var ajaxDoneEv =  config.events.ajaxDone;

        server.get = getFn;
        server.getQuietly = getQuietlyFn;

        //IE cannot handle Event Source, so it can't get the notifications, so it can't receive a signal to clear the cache, so we don't use the cache on IE
        server.cacheGet = bowser.msie ? getFn : cacheableGetFn;
        server.cacheGetQuietly = bowser.msie ? getQuietlyFn : cacheableGetQuietlyFn;

        server.post = postAsyncFnV2;
        server.postAndForget = postFn;
        server.dtoFactory = dtoFactory;
        server.delete = deleteFn;
        server.expireCache = expireCacheFn;
        server.verifyFolioId = verifyFolioId;

        server.uploader =  new fileUploader({
            url: '/api/storage/documents?format=json'
        });

        /* Initialise global OFX uploader object and event handlers */
        server.ofxUploader = new fileUploader({
            url:  '/api/financial/bankfiles/preview?format=json'
        });

        server.ofxUploader.onBeforeUploadItem = function(item) {
            server.ofxUploader.response = null;
            server.ofxUploader.uploadWarning = '';
            server.ofxUploader.uploadError = '';
            server.ofxUploader.uploadInfo = '';
        };

        server.ofxUploader.onCompleteItem = function(fileItem, response, status, headers) {
            server.ofxUploader.response = response;
            server.ofxUploader.uploadWarning = '';
            server.ofxUploader.uploadError = '';
            server.ofxUploader.uploadInfo = '';
            if (response.ResponseStatus.ErrorCode === 'Error') {
                server.ofxUploader.uploadError = response.ResponseStatus.Message;
            } else {
                if (response.ResponseStatus.ErrorCode === 'Warn') {
                    server.ofxUploader.uploadWarning = response.ResponseStatus.Message;
                }
            }

            if (response.ResponseStatus.Message === 'Upload size exceeds httpRuntime limit.') {
                server.ofxUploader.uploadError = 'The file you are uploading is too large';
            }
        };

        server.ofxUploader.onProgressItem = function(fileItem, progress) {
            server.ofxUploader.uploadWarning = '';
            server.ofxUploader.uploadError = '';
            server.ofxUploader.uploadInfo = 'Bank file upload in progress, please wait...';
        };

        function getQuietlyFn(url) {
            return getFn(url, true);
        }

        function getFn(url, ignoreLoadingBar) {

            var newUrl = getUrl(url);

            return $http.get(newUrl, {ignoreLoadingBar: ignoreLoadingBar})
                .error(errorHandle);
        }

        function expireCacheFn(url) {
            var cacheKey = getUrl(url);
            pmCachingService.remove(cacheKey);
        }

        function cacheableGetFn(url, affectedBy, ignoreLoadingBar) {
            var cacheKey = getUrl(url);
            var fromCache = pmCachingService.get(cacheKey);
            if (!_.isEmpty(fromCache)) {
                var deferred = $q.defer();
                deferred.resolve(fromCache);
                deferred.promise.success = function (fn) {
                    return deferred.promise.then(function(res) {
                        fn(res.data, res.status, res.headers);
                    });
                };
                return deferred.promise;
            } else {
                var promise = getFn(url, ignoreLoadingBar);
                promise.then(function(res) {
                    pmCachingService.cacheWithAutoExpire(cacheKey, res, affectedBy);
                });
                return promise;
            }
        }

        function cacheableGetQuietlyFn(url, affectedBy) {
            return cacheableGetFn(url, affectedBy, true);
        }

        function deleteFn(url, obj) {
            var newUrl = getUrl(url);

            return $http.delete(newUrl, {params: obj})
                .error(errorHandle);
        }

        function postFn(url, obj) {
            $rootScope.$broadcast('server:posted');

            var newUrl = getUrl(url);

            return $http.post(newUrl, obj)
                .error(errorHandle);
        }

        function postAsyncFnV2(url, obj) {
            $rootScope.$broadcast('server:posted');

            var newUrl = getUrl(url);

            // Wrap the polling in a standard promise
            var deferred = $q.defer();

            var _ignoreLoadingBar;
            if (obj) {
                _ignoreLoadingBar = obj.ignoreLoadingBar;
            }

            $http.post(newUrl, obj, { ignoreLoadingBar: _ignoreLoadingBar })
                .error(function (data, status) {
                    errorHandle(data, status);
                    var message = '';
                    if (data && data.ResponseStatus && data.ResponseStatus.Message) {
                        message = data.ResponseStatus.Message;
                    } else {
                        message = data;
                    }
                    deferred.reject(message);
                })
                .success(function (response) {
                    if (response.ResponseStatus && response.ResponseStatus.ErrorCode === 'posted') {
                        pollPostingStatus(response.TrackingIds, deferred);
                    } else {
                        deferred.resolve(response);
                        $rootScope.$broadcast(ajaxDoneEv);
                    }
                });

            // Fake a httpPromise success
            var promise = deferred.promise;

            promise.success = function (success, failure) {
                return promise.then(success, failure);
            };
            return promise;
        }

        function pollPostingStatus(trackingIds, deferred) {
            var trackingId = trackingIds[0];
            var pollUrl =  "/api/financial/postingStatus/pop/" + trackingId;

            $http
                .get(pollUrl, { ignoreLoadingBar: true })
                .success(function (body) {
                    if (body.ResponseStatus && body.ResponseStatus.ErrorCode === "posted") {
                        $timeout(function () {
                            pollPostingStatus(trackingIds, deferred);
                        }, 1000);

                    } else if (body.ResponseStatus) {
                        deferred.resolve(body);
                        $rootScope.$broadcast(ajaxDoneEv);
                    } else {
                        deferred.reject(body);
                        $rootScope.$broadcast(ajaxDoneEv);
                    }
                })
                .error(function (response, status) {
                    deferred.reject(response);
                    $rootScope.$broadcast(ajaxDoneEv);
                    if (status === 401) {
                      window.location = "/sign-in";
                    }
                });
        }

        function errorHandle(data, status) {
            if (status === 401) {
              window.location = "/sign-in";
            }
        }

        function getUrl(url)
        {
            var newUrl = url;

            if (!newUrl.match("^/")) {
                newUrl = '/api/' + newUrl;
            }
            if (newUrl.indexOf("format=json") < 0) {
                if (newUrl.indexOf("?") < 0) {
                    newUrl += '?format=json';
                } else {
                    newUrl += '&format=json';
                }
            }


            return  newUrl;
        }

        function verifyFolioId(folioId)
        {
            //if folioId is null or undefined, redirect to list page.
            if (!folioId) {
                window.location = '/owner/';
            }
        }
    }
}());
