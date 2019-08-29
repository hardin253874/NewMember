(function () {
    'use strict';
    angular.module('app').service('pmCachingService', ['$rootScope', service]);

    function service($rootScope) {
        var that = this;

        var caches = {};
        var invalidations = {};

        that.cache = function(cacheKey, cacheValue) {
            if (_.isEmpty(cacheKey) || _.isEmpty(cacheValue)) {
                return;
            }

            if (cacheKey in caches) {
                //console.log('[pmCachingService] cacheKey is already taken: ' + cacheKey);
                return;
            }

            caches[cacheKey] = cacheValue;
            //console.log('[pmCachingService] accepted cacheKey: ' + cacheKey, cacheValue);
        };

        that.cacheWithAutoExpire = function(cacheKey, cacheValue, affectedBy) {
            that.cache(cacheKey, cacheValue);
            that.invalidateCacheWhen(cacheKey, affectedBy);
        };

        that.get = function(cacheKey) {
            if (cacheKey in caches) {
                //console.log('[pmCachingService] cache hit: ' + cacheKey);
                return caches[cacheKey];
            }
            //console.log('[pmCachingService] cache miss: ' + cacheKey);
            return undefined;
        };

        that.remove = function(cacheKey) {
            if (cacheKey in caches) {
                delete caches[cacheKey];
                //console.log('[pmCachingService] deleted cacheKey: ' + cacheKey);
            }
        };

        that.invalidateCacheWhen = function(cacheKey, affectedBy) {
            if (!_.isEmpty(affectedBy) && _.isArray(affectedBy)) {
                if (!_.contains(_.keys(invalidations), cacheKey)) {
                    invalidations[cacheKey] = [];
                }

                affectedBy.forEach(function(el) {
                    var event = 'affected:' + el.toLowerCase();
                    if (!_.contains(invalidations[cacheKey], event)) {
                        invalidations[cacheKey].push(event);
                        //console.log('[pmCachingService] registered invalidation: ', event, cacheKey);

                        $rootScope.$on(event, function() {
                            //console.log('[pmCachingService] deleted cacheKey: ' + cacheKey + ' due to ' + event);
                            that.remove(cacheKey);
                        });
                    }
                });
            }
        };

        // expire cache for labeltemplate
        $rootScope.$on('affected:labeltemplate', expireCache);

        function expireCache(event) {
            var newCaches = {};
            for (var property in caches) {
                if (caches.hasOwnProperty(property) && !property.startsWith('/api/common/labels/template')) {
                    newCaches[property] = caches[property];
                }
            }

            caches = newCaches;
        }
    }
})();