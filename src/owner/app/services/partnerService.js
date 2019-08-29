(function () {
    'use strict';
    angular.module('app').service('partnerService', ['server', partnerService]);
    function partnerService(server) {
        var customerPartnerPath = '/api/entity/customerpartner/';
        var self = this;
        self.currentPartner = null;
        self.activePartners = [];
        self.getPartner = getPartner;
        self.getCurrentPartner = getCurrentPartner;
        self.getAllPartners = getAllPartners;
        self.setPartner = setPartner;
        self.updatePartnerAccess = updatePartnerAccess;
        self.removePartnerAccess = removePartnerAccess;
        self.init = init;

        return self;

        ///////////

        function init() {
            getCurrentPartner().success(function (response) {
                if (_.isEmpty(response)) {
                    return;
                }
                self.currentPartner = response;
                self.currentPartner.Website = createValidURI(response.Website);
            });

            getAllPartners().success(function (response) {
                self.activePartners = _.where(response, {IsActive: true});
            });
        }
        
        function getCurrentPartner() {
            return server.get(customerPartnerPath);
        }

        function getAllPartners() {
            return server.get('/api/administration/partners');
        }

        function getPartner(partnerId) {
            return server.get('/api/administration/partner/' + partnerId);
        }
        
        function setPartner(partnerId, permission) {
            var dto = {
                PartnerId: partnerId,
                Permission: permission
            };
            return server.post(customerPartnerPath, dto);
        }

        function updatePartnerAccess(partnerId, permission) {
            var dto = { PartnerId: partnerId, Permission: permission };
            return server.post(customerPartnerPath + partnerId, dto);
        }

        function removePartnerAccess(partnerId) {
            var dto = { PartnerId: partnerId };
            return server.post(customerPartnerPath + partnerId + '/delete', dto);
        }

        function createValidURI(s) {
            if (_.isEmpty(s)) {
                return;
            }

            if (!s.match(/^[a-zA-Z]+:\/\//))
            {
                s = 'http://' + s;
            }

            return s;
        }
    }
}());