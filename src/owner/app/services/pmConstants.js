(function () {
    'use strict';
    var PATH_MAP = {
        Agency: null,
        Bill: null,
        Contact: '#/contact/card/',
        Job: '#/jobtask/card/',
        Journal: '#/transaction/card/',
        Lot: '#/property/card/',
        Receipt: null,
        Reconciliation: null,
        Supplier: '#/folio/transactions/',
        Ownership: '#/folio/transactions?ownershipId=',
        Task: '#/task/card/',
        Tenancy: '#/folio/tenant/',
        TenantInvoice: null,
        User: null,
        Message: '#/message/preview/',
        Email: '#/message/preview/',
        Letter: '#/message/preview/',
        SMS: '#/message/preview/',
        MessageThread: '#/message/thread/',
        RentAdjustment: null,
        Statement: null,
        Inspection: '#/inspection/card/',
    };

    var CONSTANTS = { GuidEmpty: '00000000-0000-0000-0000-000000000000' };

    angular.module('app').constant('PATH_MAP', PATH_MAP);
    angular.module('app').constant('CONSTANTS', CONSTANTS);
})();