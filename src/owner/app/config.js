/* globals angular toastr  */

(function () {
    'use strict';

    var app = angular.module('app');

    var events = {
        userSignedIn: 'user.signedIn',
        userSignedOut: 'user.signedOut',
        refreshData: 'ux.refreshData',
        recalcData: 'ux.recalcData', //used for 'refreshes' that do not involve calling the server
        expandAddress: 'ux.expandAddress',
        setVideoUrl: 'ux.setVideoUrl',
		mapReady: 'ux.mapReady',
        uploadNewFile: 'ux.uploadNewFile',
        uploadFinishedAll: 'ux.uploadFinishedAll',
        uploadFinishedItem: 'ux.uploadFinishedItem',
        refreshSystemAlerts: 'ux.refreshSystemAlerts',
        noItemsInTaskList: 'pmTaskList.noItems',
        currentFileProcessed: 'files:currentFileProcessed',

        ajaxDone: 'ajax.done',
        serverDisconnected: 'server:disconnected',
        serverReconnected: 'server:reconnected',
        updateFilters: 'ux.updateFilters'
    };

    var PATH_MAP = {
        Agency: null,
        Bill: null,
        Contact: '#/contact/card/',
        Job: '#/jobtask/card/',
        Journal: null,
        Lot: '#/property/card/',
        Receipt: null,
        Reconciliation: null,
        Supplier: '#/contact/card/',
        Task: '#/task/card/',
        Tenancy: '#/folio/transactions/',
        TenantInvoice: null,
        Ownership: '#/folio/transactions/',
        User: null,
        //Message: '#/message/preview/',
        //Email: '#/message/email-preview/',
        //Letter: '#/message/preview/',
        //SMS: '#/message/preview/',
        MessageThread: '#/message/thread/',
        Conversation: '#/message/thread/',
        RentAdjustment: null,
        Statement: null,
        Inspection: '#/inspection/card/',
    };
    var config = {
        version: PM_VERSION,
        appErrorPrefix: '[PM Error] ', //Configure the exceptionHandler decorator
        docTitle: 'PropertyMe: ',
        events: events,
        session: null,
        ownerProperties: 0,
        sessionTimeoutUrl: '/sign-in',
        pastRoutes: [],
        pageSize:50,
        routeBack: function () {
            this.pastRoutes.shift();
            var url = this.pastRoutes.shift();
            window.location = url;
        },
        enabledProviders: null,
        PATH_MAP: PATH_MAP,
    };

    app.value('config', config);

    app.config(['$logProvider', 'ChartJsProvider', function ($logProvider, chartJsProvider ) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
    }]);

    app.config(['$httpProvider', function($httpProvider) {
        // Force application id to be sent with every request

        var applicationId = 'PropertyMe WebApp ' + PM_VERSION;
        $httpProvider.defaults.headers.common['x-application-id'] = applicationId;
        $httpProvider.defaults.withCredentials = true;

        $httpProvider.interceptors.push(function ($q) {
          return {
            'request': function (config) {
              if (!config.url.startsWith(PM_SERVERROOT) && config.url.contains('api/')){
                config.url = PM_SERVERROOT + config.url;
              }
              return config || $q.when(config);

            }

          }
        });

        $.ajaxSetup({
              beforeSend: function(xhr) {
                  xhr.setRequestHeader('x-application-id', applicationId);
              }
          });
      }]);
})();
