/**
 * Created by tomwu on 20/04/15.
 */

(function () {
    'use strict';

    angular.module('app').service('lookupDataService', ['server', lookupDataService]);

    function lookupDataService(server) {
        var service = this;
        service.loadManagers = loadManagers;

        function loadManagers(placeholder) {
            if (!placeholder) {
                placeholder = '(no manager)';
            }
            return server
                .getQuietly('/api/settings/members?Role=admin,standard,limited&format-json')
                .success(function (response) {
                    response.unshift({Id:null, Name:placeholder});
                });
        }
    }
})();