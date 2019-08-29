(function () {
    'use strict';

    angular.module('app').controller('ownerPropertyCardInspectionsController', ['$routeParams',  'server', myController]);

    function myController($routeParams,  server) {
        var vm = this;
        vm.id = $routeParams.id;
        vm.ownershipId = $routeParams.OwnershipId;
        vm.showThisMany = 3;

        init();

        ////////////

        function init() {
            server.verifyFolioId(vm.id);

            server.getQuietly('portal/own/' + vm.id + '/inspections?OwnershipId=' + vm.ownershipId)
                .success(
                    function (data) {
                        vm.Inspections = data;
                        prepareInspections();
                    }
                );

        }

        ////////////

        function prepareInspections() {
            vm.Inspections.forEach(function(inspection) {
                if (inspection.ClosedOn) {
                    inspection.DateToShow = inspection.ClosedOn;
                    inspection.DateToShowMsg = 'Finished on';
                } else {
                    inspection.DateToShow = null;
                    inspection.DateToShowMsg = 'Upcoming';
                }

            });
        }



    }
})();
