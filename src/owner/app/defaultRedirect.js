(function () {
    'use strict';

    angular.module('app').controller('siteDefaultController', ['$location', 'config', siteDefaultController]);

    function siteDefaultController($location, config) {
        var vm = this;

        // vm.isAgent = !!(config.session.AgentAccess);
        //
        // if (vm.isAgent) {
        //     if (setupProgressService.isInitialised) {
        //         handleSetupProgress();
        //     } else {
        //         setupProgressService.afterInit.push(handleSetupProgress);
        //     }
        // }

        // function handleSetupProgress() {
        //     vm.isShowingSetup = setupProgressService.isShowing;
        // }



    }
})();
