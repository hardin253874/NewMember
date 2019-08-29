(function () {
	'use strict';
	angular.module('app').service('regionService', ['server', 'ux', regionService]);

    function regionService (server, ux) {

		var self = {
            init: init,
		    regions: [],
            countries: []
        };

		return self;

        function init() {
            var test = server.getQuietly('/api/settings/regions')
                .success(function (data) {
                        self.regions = data;
                        data.forEach(function (region) {
                                var country = {'Name': region.Country};
                                var exists = false;
                                self.countries.forEach(function (existingCountry) {
                                        if (existingCountry.Name === country.Name) { exists = true; }
                                    }
                                );
                                if (!exists) {
                                    self.countries.push(country);
                                }
                            }
                        );
                    }
                )
                .error(function (data) {
                        ux.alert(data);
                    }
                );
            return test;
        }
    }
}());