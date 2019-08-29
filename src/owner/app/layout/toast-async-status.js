(function () {
	'use strict';

	angular.module('app').controller('toastAsyncStatusController', ['$timeout', '$rootScope', '$scope', 'ux', 'config', 'disburseService', controller]);

	function controller($timeout, $rootScope, $scope, ux, config, disburseService) {
		var vm = this;

		vm.showDisbursingToast = false;
        vm.showInvoicingToast = false;
        //vm.statusGroups = null;
		//$rootScope.$on('notifications:refreshed', function () {
         //   if (!vm.statusGroups) {
         //       vm.statusGroups = noticeSvc.statusGroups;
         //   }
		//	vm.showToast = vm.statusGroups.length > 0;
		//});

		$rootScope.$on('status:disbursed', function (obj, status) {
			vm.showDisbursingToast = status.isDisbursing;
			$timeout(function () {
				$scope.$apply();
			});
		});

        $rootScope.$on('status:rent-invoicing', function (obj, status) {
            vm.showInvoicingToast = status;
            $timeout(function () {
                $scope.$apply();
            });
        });
	}
})();
