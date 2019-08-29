(function () {
    'use strict';
    angular.module('app').service('reiFormsService', ['$rootScope', '$q', 'server', 'config', eventService]);

    function eventService ($rootScope, $q, server, config) {
        var svc = this;

        svc.init = init;
        svc.save = save;
        svc.getTemplates = getTemplates;
        svc.merge = merge;
        svc.isEnabled = isEnabled;

        $rootScope.$on('affected:agency', function(scope, eventLog) {
            if (eventLog.Action === 'Updated') {
                init();
            }
        });

        return svc;

        /////////////////////

        function init() {
            svc.getTemplates();
        }

        function merge(entityId, entityType, entityReference, templateId, templateCode, templateName, callback) {
            var formName = '[' + templateCode + '] ' + templateName + ' - ' + entityReference;

            var dto = { FormName: formName };

            switch(entityType) {
                case 'tenant':
                    angular.extend(dto, { TenancyId: entityId });
                    break;
                case 'inspection':
                    angular.extend(dto, { InspectionId: entityId });
                    break;
                case 'owner':
                    angular.extend(dto, { OwnershipId: entityId });
                    break;
                case 'sale':
                    angular.extend(dto, { SaleId: entityId });
                    break;
                default:
                    throw "merge: templates not found";
            }

            server.post('/api/rei/merge/' + templateId + '/' + templateCode + '/' + entityType, dto)
                .success(function(response) {
                    callback(response);
                });
        }


        function save(entityId, entityType, formId, formName, templateCode, templateId, token, callback) {
            var dto = { FormId: formId, FormName: formName, TemplateCode: templateCode, TemplateId: templateId, Token: token };

            switch(entityType) {
                case 'tenant':
                    angular.extend(dto, { TenancyId: entityId });
                    break;
                case 'inspection':
                    angular.extend(dto, { InspectionId: entityId });
                    break;
                case 'owner':
                    angular.extend(dto, { OwnershipId: entityId });
                    break;
                case 'sale':
                    angular.extend(dto, { SaleId: entityId });
                    break;
                default:
                    throw "save: templates not found";
            }
            server.post('/api/rei/save/' + token + '/' + entityType, dto)
                .success(function() {
                    if (callback) {
                        callback();
                    }
                });
        }

        function getTemplates(callback) {
            // check that REI is enabled
            if (!isEnabled()) {
                return;
            }

            if (config.session && config.session.AgentAccess) {
                server.getQuietly('/api/rei/all-templates')
                    .success(
                        function (res) {
                            if (callback) {
                                callback(res);
                            }
                        }
                    )
                    .error(function(error) {
                        console.error('Could not get REI templates: ' + error.ResponseStatus.Message);
                    });
            }
        }

        function isEnabled() {
            var enabled = false;

            if (!config.enabledProviders) {
                return enabled;
            }

            for(var i=0;i < config.enabledProviders.length; i++) {
                var integration = config.enabledProviders[i];
                enabled = enabled || (integration.indexOf('REI') > -1);
            }
            return enabled;
        }
    }
}());
