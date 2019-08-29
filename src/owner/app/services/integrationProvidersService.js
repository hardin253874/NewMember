(function () {
    'use strict';
    angular.module('app').service('integrationProvidersService', ['$rootScope', 'ux', '$location', '$http', 'logger', 'config', 'permissionService', integrationProvidersService]);
    function integrationProvidersService ($rootScope, ux, $location, $http, logger, config, permissionService) {
        var integrationUrl = '/api/settings/integrationprovider/';

        var self = {
            init: init,
            saveIntegration: saveIntegration,
            getIntegration: getIntegration,
            isWaiting: false,
            isReady: false
        };

        return self;

        function init() {
            // portal users don't need to init this service at all.
            if($rootScope.isPortalPage) return;

            self.isWaiting = true;
            return $http.get(integrationUrl + 'enabledlist')
                .error(function (data, status) {
                    self.isWaiting = false;
                    config.enabledProviders = [];
                })
                .success(function (integrationProviders) {
                    self.isReady = true;
                    self.isWaiting = false;
                    config.enabledProviders = integrationProviders.ExternalProviderTypes;
                });
        }

        function getIntegration(integrationId, callback) {
            var integration = {};
            if (integrationId) {
                $http.get(integrationUrl + integrationId)
                    .success(function (result) {
                        if (callback) {
                            callback(result.Integration);
                        }
                    });
            }

            return integration;
        }

        function saveIntegration(integration) {
            var success = false;
            var apiUrl = integrationUrl;
            if (integration.Id !== '00000000-0000-0000-0000-000000000000') {
                apiUrl += integration.Id;
            }

            $http.post(apiUrl, integration)
                .success(function (response) {
                    success = true;
                    init();
                    ux.alert.response(response, 'Saved integration settings');
                }).error(function(res) {
                    ux.alert.error(res.ResponseStatus.Message);
                });

            return success;
        }
    }
}());