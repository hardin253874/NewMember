(function () {
    'use strict';

    angular.module('app').controller('ownerJobController', ['$routeParams', '$scope', 'server', 'textFormat', ownerJobController]);

    function ownerJobController($routeParams, $scope, server, textFormat) {
        var vm = this;
        vm.FolioId = $routeParams.folioId;
        vm.JobTaskId = $routeParams.id;
        vm.ownershipId = $routeParams.OwnershipId;
        init();

        ////////////

        function init() {
            server.verifyFolioId(vm.FolioId);

            server.getQuietly('portal/agent/' + vm.FolioId).success(function (data) {
                vm.Agent = data;
              if (vm.Agent && vm.Agent.LogoDocumentUrl && vm.Agent.LogoDocumentUrl.startsWith('/api')) {
                vm.Agent.LogoDocumentUrl = PM_SERVERROOT + vm.Agent.LogoDocumentUrl;
              }
            });

            //Info about folio and property, perhaps we can store this in owner's session?
            server.getQuietly('portal/own/' + vm.FolioId + '/ownership/' + vm.ownershipId).success(function (data) {
                vm.folio = data;
            });

            server.getQuietly('portal/own/' + vm.FolioId + '/jobs/' + vm.JobTaskId).success(function (data) {
                vm.dto = data;
            });
            server.getQuietly('portal/own/' + vm.FolioId + '/job/' +  vm.JobTaskId + '/photos').success(function (data) {
                vm.photos = data;
            });

        }

        ////////////

    }
})();
