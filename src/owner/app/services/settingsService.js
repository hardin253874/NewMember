(function () {
	'use strict';
	angular.module('app').service('settingsServiceProxy', ['server', service]);

    function service (server) {
        var svc = this;
        var _bankAccountURL = '/api/settings/bankaccountsettings';
        var _officeSettingUrl = '/api/settings/officesettings';

        svc.clearCache = function () {
            server.expireCache(_bankAccountURL);
            server.expireCache(_officeSettingUrl);
        };

        svc.getBankAccountSettings = function(callback) {
            server.cacheGetQuietly(_bankAccountURL, 'BankAccount').success(callback);
        };

        svc.getOfficeSettings = function(callback) {
            server.cacheGetQuietly(_officeSettingUrl, 'OfficeSetting').success(callback);
        };

        return svc;

    }
}());