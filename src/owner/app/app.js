(function () {
  'use strict';

  var app = angular.module('app', [
    // Angular modules
    'ngAnimate',        // animations
    'ngRoute',          // routing
    'ui.select',        // UI select (ex: labels, messages)
    'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)

    // 3rd Party Modules
    'ui.bootstrap',     // ui-bootstrap (needed for dropdown menus) (ex: carousel, pagination, dialog)

    'ui.select',     // angular-ui selector, for multi-selection

    // Loading Bar causes exceptions on post errors
    'angular-loading-bar', //Automatic loading bar when $http call

    'angularFileUpload',

    'easypiechart',
    //'ngTouch',
    'ng-sortable',
    'mp.colorPicker',
    'ngTagsInput',
    'chart.js'
  ]);

  // Handle routing errors and success events
  app.run(['$route', '$rootScope', '$http', 'dtoFactory', 'ux', 'routeHistory', 'session', 'userGeoLocation', 'integrationProvidersService',
    'reiFormsService', 'regionService', 'partnerService', 'config', 'locationHelper', run]);

  function run($route, $rootScope, $http, dtoFactory, ux, routeHistory, session, userGeoLocation, integrationProvidersService,
               reiFormsService, regionService, partnerService, config, locationHelper) {

    $rootScope.isPortalPage = false;    // set default value;
    $rootScope.location = locationHelper;
    $rootScope.isSettingsView = false;
    $rootScope.modalResult = null;
    $rootScope.isDarkMenuOn = false;

    rg4js('apiKey', PM_ERRCODE);
    rg4js('options', {
          excludedHostnames: ['\.local', '127.0.0.1', 'uat-app.propertyme.com'],
          ignore3rdPartyErrors: true,
          allowInsecureSubmissions: true,
          ignoreAjaxAbort: true,
          ignoreAjaxError: true });
    rg4js('attach', true);
    rg4js('enablePulse', false);
    rg4js('enableCrashReporting', true);
    rg4js('onBeforeSend', runBeforeSendingToRaygun);

    getServerUrlCookie();

    //session.init().then(userGeoLocation.init).then(redirectOnLoad.go);
    session.init()
      .then(userGeoLocation.init);
      //.then(integrationProvidersService.init);

    // after session object initialised
    $rootScope.$on(config.events.userSignedIn, function(e) {
      // if (config.session.AgentAccess) {
      //   partnerService.init();
      // }
    });

    dtoFactory.init(); //loading meta data models
    ux.init();
    routeHistory.init();
    regionService.init();

    reiFormsService.init();

    moment.locale('en-au');

    ////////////////////

    function runBeforeSendingToRaygun(payload) {
      console.error(JSON.stringify(payload.Details.UserCustomData, true, 2));

      if (errorCanBeIgnored(payload.Details.UserCustomData)) {
        // ignore the error
        return false;
      }

      if (libErrorCanBeIgnored(payload.Details)) {
            // if error is caused by third party components which is concat to lib.js
            // because there is not source maps for the lib file, the crash report only can see the uglify results
            // if all stack traces are belong to lib file, means the error is not caused PropertyMe code
            // so this error can be ignored.
            return false;
      }

      // continue with error reporting
      return payload;
    }

    function errorCanBeIgnored(errorData) {
      var ignore = false;
      ignore = ignore || errorData.url && errorData.url.indexOf('heartbeat') > -1;
      ignore = ignore || (errorData.status && errorData.status === 401);
      ignore = ignore || (errorData.status && errorData.status === 403);
      ignore = ignore || (errorData.status && errorData.status === 404);

      return ignore;
    }

    function libErrorCanBeIgnored(errorDetails){
      if (!errorDetails || !errorDetails.Error || !errorDetails.Error.StackTrace){
          return false;
      }

      var libErrorStackTraces = errorDetails.Error.StackTrace.find(function(errorStackTrace) { return errorStackTrace.FileName && errorStackTrace.FileName.indexOf('/app/dist/scripts/lib') > -1; });

      return (libErrorStackTraces && libErrorStackTraces.length === errorDetails.Error.StackTrace.length);
    }

    function checkMaximumRaygunMessage() {
      var pass = true;

      var cookies = {};
      angular.forEach(document.cookie.split(';'), function(value) {
        var cookie = value.split('=');
        if (cookie.length == 2) {
          cookies[cookie[0].trim()] = cookie[1].trim();
        }
      });

      var raygunMessageCount = cookies['raygun-message-count'];
      var cookieValues = [];
      if (typeof raygunMessageCount === 'string') {
        cookieValues = raygunMessageCount.split('|');
      }

      if (cookieValues.length > 1 && !isNaN(cookieValues[0]) && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.test(cookieValues[1])) {
        if (parseInt(cookieValues[0]) > 100) {
          pass = false;
        } else {
          document.cookie = 'raygun-message-count=' + (parseInt(cookieValues[0]) + 1) + '|' +
            cookieValues[1] + '; expires=' + (new Date(cookieValues[1])).toUTCString() + ';';
        }
      } else {
        var now = new Date();
        var expiry = new Date(now);
        expiry.setHours(now.getHours() + 12);
        document.cookie = 'raygun-message-count=0|' + expiry.toISOString() + '; expires=' + expiry.toUTCString() + ';';
      }

      return pass;
    }

    function getServerUrlCookie() {
      if (document.cookie) {
        var value = '; '  + document.cookie;
        var parts = value.split('; serverUrl=');
        if (parts.length == 2) {
          PM_SERVERROOT = parts.pop().split(';').shift();
          if (PM_SERVERROOT && PM_SERVERROOT.endsWith('/')) {
            PM_SERVERROOT = PM_SERVERROOT.slice(0,-1);
          }
        }
      }
    }
  }

})();
