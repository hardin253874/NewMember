(function () {
	'use strict';
	angular.module('app').service('agencyFees', ['server', 'ux', agencyFees]);
    function agencyFees (server, ux) {
        var apiPath = '/api/financial/agencyfees/';
        
        return {
            all: all,
            add: add,
            get: get,
            update: update,
            validate: validate
        };

        function all(folioId) {
            if (_.isUndefined(folioId)) {
              folioId = '';
            }
            
            return server.get(apiPath + '?FolioId=' + folioId);
        }
        
        function validate(fee, template) {
            if (_.isEmpty(fee.OwnershipId) && template.ChargeType === 'Ownership') {
                ux.alert.warning('This fee must be assigned to a property', 'Owner Fee');
                return false;
            }

            if (fee.Value <= 0) {
                ux.alert.warning('Please enter a value greater than 0', 'Owner Fee');
                return false;
            }
            
            return true;
        }
        
        function add(templateId, folioId, ownershipId, value) {
          var data = {
            AgencyFeeTemplateId: templateId,
            FolioId: folioId,
            OwnershipId: ownershipId,
            Value: value
          };

          return server.post(apiPath, data);
        }
        
        function get(id) {
          return server.get(apiPath + id);
        }
        
        function update(id, value, ownershipId) {
          var data = {
              Id: id,
              Value: value,
              OwnershipId: ownershipId
          };
          
          return server.post(apiPath + id, data);
        }
    }
}());