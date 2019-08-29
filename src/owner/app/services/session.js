(function () {
	'use strict';
    angular.module('app').service('session', ['$rootScope', '$window', '$location', '$http',
        'logger', 'config', 'permissionService', 'zendeskService', 'locationHelper', sessionService]);
    function sessionService ($rootScope, $window, $location, $http, logger, config, permissionService, zendeskService, locationHelper) {

		var self = {
		    init: init,
            isWaiting: false,
            isReady: false,
            afterInit: [],
            hasBsb: hasBsb,
            isEdgeOrIE: isEdgeOrIE
        };

		return self;

        function init() {
            self.isWaiting = true;


			return $http.get('/api/sec/user/session')
                .error(function (data, status) {
                    self.isWaiting = false;
                    if (status === 401) {
                      window.location = "/sign-in";
                    } else {
                        logger.logError(status + " error requesting data", null, true);
                    }
                })
                .success(function (session) {
                    self.isReady = true;
                    self.isWaiting = false;
                    config.session = session;
                    permissionService.init(session);
                    //logger.log(session);
                    $rootScope.isAppLoaded = true;

                    self.afterInit.forEach(function(fn) {fn();});
                    self.afterInit = [];

                    $rootScope.session = session;
                    $rootScope.isDarkMenuOn = session.Preferences && session.Preferences.IsDarkMenuOn;

                    //raygunPulse(session);

                    //zendeskService.loadZendeskWidget(session);

                    if (session != null && session.AgentAccess != null && session.AgentAccess.SubscriptionStatus === 'TrialExpired') {
                        locationHelper.go('/');
                    }
                });
        }

        function hasBsb() {
            return config.session.Region.CountryCode === 'AU';
        }

        function raygunPulse(session) {
            rg4js('setVersion', session.ApplicationVersion);

            rg4js('setUser', {
                identifier: session.RegisteredEmail,
                isAnonymous: false,
                email: session.RegisteredEmail,
                firstName: session.FirstName,
                fullName: session.Name
            });

            $rootScope.$on('$locationChangeSuccess', function (event, current) {
                $window.Raygun.trackEvent('pageView', {
                        path: '/#' + $location.url()
                    }
                );
            });
        }

        function isEdgeOrIE() {
            var userAgent = $window.navigator.userAgent;
            if (userAgent) {
                // var msie = userAgent.indexOf('MSIE ');
                // if (msie > 0) {
                //     // IE 10 or older => return version number
                //     return parseInt(userAgent.substring(msie + 5, userAgent.indexOf('.', msie)), 10);
                // }
                //
                // var trident = userAgent.indexOf('Trident/');
                // if (trident > 0) {
                //     // IE 11 => return version number
                //     var rv = userAgent.indexOf('rv:');
                //     return parseInt(userAgent.substring(rv + 3, userAgent.indexOf('.', rv)), 10);
                // }
                //
                // var edge = userAgent.indexOf('Edge/');
                // if (edge > 0) {
                //     // Edge (IE 12+) => return version number
                //     return parseInt(userAgent.substring(edge + 5, userAgent.indexOf('.', edge)), 10);
                // }

                return userAgent.indexOf('MSIE') > 0;
            } else {
                return false;
            }


        }
    }
}());
