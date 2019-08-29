(function () {
    'use strict';
    angular.module('app').service('libraryLoader', ['$rootScope', '$window','$timeout', '$q', 'logger', myService]);
    function myService($rootScope, $window, $timeout, $q, logger) {

        var GOOGLE_API_KEY = 'AIzaSyB7awdzll-5mHk7c9kxzm4Z4CVZqiSTjYE';
        //var deferred = $q.defer();
        var self = {
            GoogleMaps: {
                deferred: $q.defer(),
                isLoaded: false,
                isWaiting: false,
                load: function () {
					if (window.google && window.google.maps) return self.GoogleMaps.deferred.promise;
                    return loadScriptFromWeb(
                        '//maps.googleapis.com/maps/api/js?key=' + GOOGLE_API_KEY  + '&v=3&language=en&libraries=places,geometry',
                        'GoogleMaps', 'callback'
                    );
                }
            },
			Stripe: {
				deferred: $q.defer(),
				isLoaded: false,
				isWaiting: false,
				load: function () {
					if (window.Stripe) return self.Stripe.deferred.promise;
					return loadScriptFromWeb(
							'https://js.stripe.com/v2/',
						'Stripe'
					);
				}
			},
            MarkerWithLabel: {
                deferred: $q.defer(),
                isLoaded: false,
                isWaiting: false,
                load: function () {
                    if (window.MarkerWithLabel) return self.MarkerWithLabel.deferred.promise;
                    return loadLocalScript(
                        'app/lib/maps/markerwithlabel.js',
                        'MarkerWithLabel'
                    );
                }
            },
			MarkerClusterer: {
				deferred: $q.defer(),
				isLoaded: false,
				isWaiting: false,
				load: function () {
					if (window.MarkerClusterer) return self.MarkerClusterer.deferred.promise;
					return loadLocalScript(
						'app/lib/maps/markerclusterer_compiled.js',
						'MarkerClusterer'
					);
				}
			}
        };

        return self;


        function loadLocalScript(url, libName, windowPropertyName) {

            if (self[libName].isWaiting || self[libName].isLoaded) {
                return self[libName].deferred.promise;
            }

            var script = document.createElement('script');
            script.src = url ;
            self[libName].isWaiting = true;
            document.body.appendChild(script);

            //wait some time for script to load and run,
            //we loop this wait, waiting for a longer period each time.
            var waitFor = 50;
            intervalHelper(function () {
                logger.log(libName + ' loaded');
                self[libName].isLoaded = true;
                self[libName].isWaiting = false;
                self[libName].deferred.resolve();
            });

            function intervalHelper(callback) {
                $timeout(function() {
                    if (check()) {
                        //console.log(libName + ' has arrived', waitFor);
                        callback();
                    } else {
                        //console.log('Waiting for ' + libName, waitFor);
                        waitFor *= 2;
                        intervalHelper(callback);
                    }
                }, waitFor );
            }
            function check() {
                 return window[windowPropertyName || libName] !== undefined;

            }



            return self[libName].deferred.promise;

        }

        function loadScriptFromWeb(url, libName, callbackParam, onError) {

            if (self[libName].isWaiting || self[libName].isLoaded) {
                return self[libName].deferred.promise;
            }

            // Use global document since Angular's $document is weak
            var script = document.createElement('script');
            var callbackName = libName + 'Callback';
            script.src = url;
            if (callbackParam) {
                script.src += '&' + callbackParam + '=' + callbackName ;
            }

			// Script loaded callback, send resolve
            $window[callbackName] = function () {
                logger.log(libName + ' loaded');
                self[libName].deferred.resolve();
                self[libName].isLoaded = true;
                self[libName].isWaiting = false;
            };
            self[libName].isWaiting = true;

			if (!callbackParam) {
				script.onload = $window[callbackName];
			}

            script.onerror = function(){
                var errorInfo = 'The internet isn\'t available.';
                logger.log(errorInfo);

                self[libName].deferred.reject(errorInfo);
            };

			document.body.appendChild(script);
			return self[libName].deferred.promise;

        }

    }
}());