(function () {
    'use strict';

    angular.module('app').controller('ownerStatementFilesController', ['$routeParams', 'server', 'textFormat', controller]);

    function controller($routeParams, server, textFormat) {
        var vm = this;
        vm.currencySymbol = textFormat.currencySymbol;
        vm.id = $routeParams.id;
        vm.fileId = $routeParams.folioId;
        vm.serverUrl = PM_SERVERROOT;
        init();

        ////////////

        function init() {
            server.verifyFolioId(vm.fileId);

            // Includes statements and documents directly linked to this owner. Excludes bills and photos.
            server.getQuietly('portal/own/' + vm.fileId + '/statement-documents?StatementNumber=' + vm.id)
                .success(function (data) {
                    vm.Documents = data;
                });

            // For drilling into statements, includes the statement and bills
            //     /api/portal/own/{FolioId}/statement-documents?StatementNumber=11

        }
    }
})();
