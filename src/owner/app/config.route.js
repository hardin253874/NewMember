(function () {
    'use strict';

    var app = angular.module('app');

    app.config(['$routeProvider', '$httpProvider', appConfig]);  // Not just routing config
    function appConfig($routeProvider, $httpProvider) {

        var isGuidRexEx = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i;

        var resolvers = {
            session: {
                session: getSession
            }
        };

        $httpProvider.interceptors.push('httpErrorInterceptor');
        //$httpProvider.interceptors.push('httpRequestInterceptor');
        $httpProvider.interceptors.push('httpResponseInterceptor');

        // Dynamic routing based on a strict simple set of rules
        // eg: /properties -> /properties/properties.html
        // eg: /properties/new  - redirect to edit

        $routeProvider
        .when('/', {
                resolve: resolvers.session,
                templateUrl: function (rp) {
                    return 'app/defaultRedirect.html';
                }
            }
        ).when('/s=0', {            // Work around for a sign in redirect issue
                resolve: resolvers.session,
                redirectTo: '/'
            }
        ).when('/own/', {
              resolve: resolvers.session,
              templateUrl: function (rp) {
                //if (isGuidRexEx.test(rp.id))
                return 'app/own/own-list.html';
              }
            }
          ).when('/:page', {
                resolve: resolvers.session,
                templateUrl: function (rp) {
                    return 'app/own/own-' + rp.page + '.html';
                }
            }
          ).when('/:page/:id', {
            resolve: resolvers.session,
            templateUrl: function (rp) {
              if (isGuidRexEx.test(rp.id)) {
                return 'app/own/own-' + rp.page + '-card.html';
              } else  {
                return 'app/' + rp.page + '/' + rp.page + '-' + rp.id + '.html';
              }
            }
          }
        ).when('/:section/:page', {
            resolve: resolvers.session,
            templateUrl: function (rp) {
              return 'app/' + rp.section + '/' + rp.section + '-' + rp.page + '.html';
            }
          }
        ).when('/:section/:folioId/:page/:id', {
            resolve: resolvers.session,
            // TODO: fix /porta/own mapping so it can grow
            templateUrl: function (rp) {
              return 'app/own/own-' + rp.page + '.html';
            }
          }
        ).when('/:section/:folioId/:page', {
            resolve: resolvers.session,
            // TODO: fix /porta/own mapping so it can grow
            templateUrl: function (rp) {
              return 'app/own/own-' + rp.page + '.html';
            }
          }
        ).otherwise({
                resolve: resolvers.session,
                redirectTo: '/'
            }
        );
    }

    getSession.$inject = ['$rootScope', 'locationHelper', '$q', 'config', 'session'];

    function getSession($rootScope, locationHelper, $q, config, session) {
        $rootScope.isSettingsView = false;
        locationHelper.closeModal();
        var deferred = $q.defer();

        if (config.session) {
            if (config.session.AgentAccess != null && config.session.AgentAccess.SubscriptionStatus === 'TrialExpired') {
                locationHelper.subscribe();
                deferred.reject();
                return deferred;
            } else  {
                return deferred.resolve();
            }
        } else {
            if (session.isWaiting) {
                session.afterInit.push(deferred.resolve);
                return deferred.promise;
            } else {
                return session.init();
            }
        }
    }

})();
