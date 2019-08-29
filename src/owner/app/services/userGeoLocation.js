(function () {
	'use strict';
	angular.module('app').service('userGeoLocation', ['config', 'server', 'libraryLoader','permissionService', userGeoLocation]);
	function userGeoLocation (config, server, libraryLoader, permissionService) {
		var service = {
			init: init,
			loadGoogle: loadGoogle,
			coords: {},
			googleLatLng: null
		};

		var Sydney = {
			longitude: 151.2069902,
			latitude: -33.867486899999996};

		return service;
		// FUNCTION //
		function init () {
			// if (permissionService.isAgent) {
			// 	getAgentContactPosition();
			// }
		}
		function loadGoogle() {
			return libraryLoader.GoogleMaps.load().then(function () {
				service.googleLatLng = new google.maps.LatLng(
					service.coords.latitude,
					service.coords.longitude);
			});
		}

		function getSessionPosition() {
			if (config.session.Region.Latitude !== null) {
				//console.log(config.session.Region);
				//console.log('Using default location data from Region');
				service.coords = {
					latitude: config.session.Region.Latitude,
					longitude: config.session.Region.Longitude
				};
			} else {
				//console.log("No location data available in session, defaulting to Sydney.");
				service.coords = Sydney;
			}
		}

		function getAgentContactPosition(){
			server.getQuietly('/api/entity/contacts/' + config.session.AgentAccess.AgentContactId)
				.success(function(dto){
					var addr ;
					try {
						addr = dto.ContactPersons[0].PhysicalAddress;
					} catch (e) {
						console.log('No location data in Agent Contact', e, dto);
					}
					if (addr.latitude && addr.longitude) {
						//console.log('Agent Contact location data found.');
						service.coords.latitude = addr.latitude;
						service.coords.longitude = addr.longitude;
					} else {
						//console.log('Agent Contact address missing latitude / longitude');
						getSessionPosition();
					}
				}).error(function() {
					console.log('Failed to load Agent Contact data');
					getSessionPosition();
				});
		}
	}
}());
