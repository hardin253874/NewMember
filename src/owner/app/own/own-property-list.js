(function () {
    'use strict';

    angular.module('app').controller('ownerPropertyListController',	['$location', 'server','textFormat', 'permissionService', 'config', '$rootScope', ownerPortalController]);

    function ownerPortalController($location, server, textFormat, permissionService, config, $rootScope) {
        var vm = this;
        var  propertyPageUrl = '/property';
        vm.currencySymbol = textFormat.currencySymbol;
        vm.displayDisburseDate = displayDisburseDate;
        vm.showAddress = showAddress;
        vm.properties = 0;
        vm.rentProperties = 0;
        vm.folios = [];
        vm.tenantFolios = [];
        vm.ownerFolios = [];
        vm.archivedProperties = [];
        $rootScope.PM_SERVERROOT = PM_SERVERROOT;
        init();

        //////////////
        function init() {

           vm.ownerFolios =  permissionService.folioAccessList
             .filter(function(folio) {
               return folio.Role === 'Owner' && !folio.IsClientAccessDisabled;
             });

          if (vm.ownerFolios && vm.ownerFolios.length > 0) {
            vm.ownerFolios.forEach(function(folio) {
              server.get('portal/own/' + folio.FolioId)
                .success(function(data) {
                  vm.folios.push(data);
                  vm.folios = _.sortBy(vm.folios, 'Code');
                  vm.properties += data.Lots.length;
                  var archivedLots = data.Lots.filter(function(l) {return !l.IsActive;});

                    vm.archivedProperties = vm.archivedProperties.concat(archivedLots.map(function(l) {
                      l.LastStatementDate = folio.LastStatementDate;
                      return l;
                  }));

                  if (config) {
                    config.ownerProperties = vm.properties;
                  }
                  if(permissionService.folioAccessList.length === 1) { // each folio has at least one property
                    redirectIfOnlyOneProperty();
                  }
                });
            });
          } else {
            window.location = "/";
          }

          vm.tenantFolios =  permissionService.folioAccessList
            .filter(function(folio) {
              return folio.Role === 'Tenant' && !folio.IsClosed && !folio.IsClientAccessDisabled;
            });

          if(vm.tenantFolios && vm.tenantFolios.length > 0) {
            vm.rentProperties = vm.tenantFolios.length;
          }
        }

        function redirectIfOnlyOneProperty() {
            //if this owner owns only one property, redirect to the property page
            if(vm.folios.length === 1 && vm.folios[0].Lots.length === 1) {
                var folio = vm.folios[0];
                $location.path(propertyPageUrl + '/' + folio.FolioId )
                    .search({OwnershipId :folio.Lots[0].OwnershipId});
            }
        }

        function displayDisburseDate(folio) {
            return (folio.DisburseFrequency && folio.DisburseFrequency !== 'Manual') ? folio.NextDisburseDate : null;
        }

        function showAddress(property) {
            if (property){
                if (property.AddressText) {
                    return property.AddressText;
                } else {
                    return property.Reference;
                }

            }

            return '';
        }
    }
})();
