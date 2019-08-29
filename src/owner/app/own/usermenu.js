(function () {
  'use strict';

  angular.module('app').controller('ownerUserMenuController', ['config', controller]);

  function controller(config) {
    var vm = this;
    vm.AccessTenant = false;


    if (config && config.session) {
      vm.memberName = config.session.Name ? config.session.Name : 'N N';
      vm.memberId = config.session.MemberId;
      if (config.session.FolioAccessList) {
        vm.AccessTenant = config.session.FolioAccessList.filter(function(folio) { return folio.Role === 'Tenant' }).length > 0;
      }
    }
  }
})();
