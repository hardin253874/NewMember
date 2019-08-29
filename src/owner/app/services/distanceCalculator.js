(function () {
	"use strict";
	angular.module('app').factory("distanceCalculator", ['$timeout','libraryLoader','logger', 'userGeoLocation', distanceCalculator]);
	function distanceCalculator ($timeout,  libraryLoader,logger, userGeoLocation) {
		function _factory (places, onGoogleLoadCallback) {
			var self = this;
			var myDictionary = {};
			var USER_LOCATION_HASH = "USER_LOCATION_HASH";
			var userLocationPoint = null;
			self.isReady = false;
			self.get = getFromDictionary;
			self.getFromHere = getFromHere;
			self.getToHere = getToHere;
			self.waitFor = 3000;

			var includeUserLocation = false;

			userLocationPoint = {
					latLng: userGeoLocation.googleLatLng,
				Latitude: userGeoLocation.coords.latitude,
				Longitude: userGeoLocation.coords.longitude,
				dto: {Id: USER_LOCATION_HASH}
			};


			initStraightLines();
            initGoogleHelper();
			self.isReady = true;

			function initStraightLines(){
				for (var i = 0; i < places.length; i++) {
					var pi = places[i];
					for (var j = 0; j < places.length; j++) {
						var pj = places[j];
						saveStraightLine(pi,pj);
					}

				}

				if (includeUserLocation) {
					for (var k = 0; k < places.length; k++) {
						var pk = places[k];
						//it will be the last row and the last cell of each
						saveStraightLine(userLocationPoint,pk);
						saveStraightLine(pk,userLocationPoint);
					}
				}



			}

            function initGoogleHelper() {
				libraryLoader.GoogleMaps.load().then(initGoogle);

            }

			function initGoogle () {
				var service = new google.maps.DistanceMatrixService();
				var pointer = 0;
				/*
				 google rules :
				 	origins <= 25
				 	destinations <= 25
				 	(origins * destinations) <= 100
				* */

				if (places.length <= 9) {
					return loader(places, onGoogleLoadCallback);
				} else {
					var q = [];
					for (var i = 0; i < places.length ; i+=9) {
						var doAChunk = function(){
							if (pointer > places.length -1 ) return;

							var arr = places.slice(pointer, 9);
							loader(arr, function (successful, msg) {
								if (!successful) {
									console.log('requeing', msg);
									//repush this function onto the q
									q.push(doAChunk);
								}
								var next = q.pop();
								if (typeof next === 'function') {
									$timeout(next,3000);
								}
							});
							pointer += 8;
						};
						q.push(doAChunk);
					}
					var next = q.pop();
					if (typeof next === 'function') next();

				}

				function loader(places, callback) {
					var origins = places.map(function (p) {
						return p.latLng;
					});

					if (includeUserLocation) {
						origins.push( userGeoLocation.googleLatLng);
					}


					service.getDistanceMatrix(
						{
							origins: origins,
							destinations: origins,
							travelMode: google.maps.TravelMode.DRIVING,
							durationInTraffic: true,
							avoidHighways: false,
							avoidTolls: false
						},
						function (googleMatrix, status_msg) {
							//https://developers.google.com/maps/documentation/javascript/distancematrix
							var okGoogle = !!googleMatrix && !!googleMatrix.rows;
							if (!okGoogle) {
								logger.log('Google Distance Matrix failure', googleMatrix, arguments.toString());
								console.log('Google Distance Matrix failure', googleMatrix, arguments);

								callback(false, status_msg);
								return;

							}

							for (var i = 0; i < places.length; i++) {
								var pi = places[i];
								for (var j = 0; j < places.length; j++) {
									var pj = places[j];
									saveGoogle(pi, pj, googleMatrix.rows[i].elements[j]);

								}

							}

							if (includeUserLocation) {
								for (var k = 0; k < places.length; k++) {
									var pk = places[k];
									//will be the last row and the last cell of each
									saveGoogle(userLocationPoint, pk, googleMatrix.rows.lastElement().elements[k]);
									saveGoogle(pk, userLocationPoint, googleMatrix.rows[k].elements.lastElement());
								}
							}



                            if (typeof callback == 'function') callback(true);

						});
				}


			}

			function hash (p, q) {
				var pt = p.dto.Id, qt = q.dto.Id;
				return pt + '_' + qt;

			}

			function getFromDictionary (pt1, pt2) {
				return myDictionary[hash(pt1, pt2)];
			}

			function getFromHere(pt) {
				if (userLocationPoint) return myDictionary[hash(userLocationPoint, pt)];
				else return null;
			}
			function getToHere(pt) {
				if (userLocationPoint) return myDictionary[hash(pt,userLocationPoint)];
				else return null;
			}

			function saveStraightLine(pt1, pt2) {
				var obj = getFromDictionary(pt1, pt2) || {};
				obj.straightLine  = getStraightlineDistance(pt1,pt2);
				myDictionary[hash(pt1, pt2)] = obj;
			}
			
			function saveGoogle (pt1, pt2, google) {
				var obj = getFromDictionary(pt1, pt2) || {};
				obj.google = google;
				obj.distance = google.distance || {text: '', value: 0};
				obj.duration = google.duration || {text: '', value: 0};
				myDictionary[hash(pt1, pt2)] = obj;
			}

			//straight line distance
			//return google.maps.geometry.spherical.computeDistanceBetween (point1.latLng, point2.latLng);
			//from http://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3
			function getStraightlineDistance (p1, p2) {
				function rad (x) {
					return x * Math.PI / 180;
				}

				var p1lat = p1.Latitude || p1.lat();
				var p1lng  = p1.Longitude || p1.lng();
				var p2lat = p2.Latitude || p2.lat();
				var p2lng  = p2.Longitude || p2.lng();


				var R = 6378137; // Earth’s mean radius in meter
				var dLat = rad(p2lat - p1lat);
				var dLong = rad(p2lng - p1lng);
				var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
					Math.cos(rad(p1lat)) * Math.cos(rad(p2lat)) *
					Math.sin(dLong / 2) * Math.sin(dLong / 2);
				var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
				var d = R * c;
				return d;
				// returns the distance in meter
			}
		}

		return _factory;
	}
})();

		
