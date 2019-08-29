(function () {
	'use strict';
	angular.module('app').factory('mapMarkerEntity', ['$timeout', 'ux', 'textFormat', factory]);
	function factory($timeout, ux, textFormat) {
		function MapMarkerEntity(dto, parentCollection) {
			var self = this;
			var isSelected = false,
				isShown = true;
			angular.extend(self,dto); //take the properties of the given dto

			if (dto === undefined) {
				console.log(dto);
			}
			
			self.isMappable = validate(dto.Latitude, dto.Longitude);
			self.dto = dto;
			self.latLng = makeLatLng(dto.Latitude, dto.Longitude);
			self.marker = null;
			self.ordinal = null;
			self.ordinalMarker = null;
			self.showOrdinal = false;
			self.isSelected = isSelected;
			self.isShown = isShown;
			self.handleClick = handleClick;
			self.clickListener = null;
			self.changeCallback = function () {};
			self.refresh = refresh;
			self.setIcon = setIcon;
			self.setOrdinal = setOrdinal;
			self.setSelected = setSelected;
			self.setShown = setShown;
			self.toggleSelected = toggleSelected;
			self.toggleShown = toggleShown;

			function validate(lat, lng) {
				var b =  lat !== null && lat !== undefined && lat >= -180 && lat <= 180 &&
						 lng !== null  && lng !== undefined && lng >= -180 && lng <= 180;
				if (!b) {
					console.log('bad lat long for', dto);
				}
				return b;
			}

			function makeLatLng(lat, lng) {
				if (self.isMappable) {
					try {
						var g = new google.maps.LatLng(lat, lng);
						//google lat longs can be declared with bad lat and long, it will only fail when we run fitBounds
						//so we check ourselves
						//console.log('attempting to make a latlng for ', lat, lng,  dto);
						//if (round(lat) !== round(g.lat()) || round(lng) !== round(g.lng()) || !g ) {
						//	//console.log('dud lat long', dto,  g);
						//	failed();
						//}
						if(!g || !isEqualFloat(lat, g.lat()) || !isEqualFloat(lng, g.lng())) {
							failed();
						}

						return g;
					} catch (e) {
						failed();
					}

				}

                return undefined;

				function failed() {
					//console.log('failed');
					self.isMappable = false;
				}

				function isEqualFloat(valueA, valueB){
					if(valueA && valueB){
						var isEqual = (valueA - valueB) < 0.000001;
						return isEqual;
					}

					return false;
				}

				//function round(val) {
				//	return textFormat.decimal(val, 6); //6 decimal places
				//}
			}

			function createMarker() {
				var mk = new google.maps.Marker({map: parentCollection.mapObj, position: self.latLng});
				return decorateMarker(mk);
			}

			function createOrdinal() {
				var mk = new MarkerWithLabel({
					position: self.latLng,
					draggable: false,
					raiseOnDrag: false,
					map: parentCollection.mapObj,
					labelAnchor: new google.maps.Point(22, 0),
					labelContent: '', //set below
					labelClass: "map-marker-ordinal", // the CSS class for the label
					labelStyle: {opacity: 1}
				});
				return decorateMarker(mk);
			}

			function decorateMarker(mk) {
				mk._PropertyMeData = {
					dto: self.dto
				};
				return mk;
			}

			function refresh () {
				if  (!self.isMappable) {
					//console.log('refresh called on unmappable items', self);
				}
				var rebindEvent = false;
				if (self.showOrdinal) {
					//Ordinals use the MarkerWithLabel object (third-party)
					if (self.marker) {
						self.marker.setMap(null);
						self.marker = null;
						rebindEvent = true;
					}
                    //create a new object only if necessary
					self.ordinalMarker = self.ordinalMarker || createOrdinal();
                    //label text always must be updated
                    self.ordinalMarker.setOptions({
                        labelContent: self.ordinal

                    });


				} else {
					//if it used to be showing the ordinal, remove it
					if (self.ordinalMarker) {
						self.ordinalMarker.setMap(null);
						self.ordinalMarker = null;
						rebindEvent = true;
					} else {
						self.marker = self.marker || createMarker();
					}

				}
				self.setIcon();
				if (rebindEvent || self.clickListener === null) {
					$timeout(function() {

                      //  google.maps.event.clearListeners(self.marker, 'click');
                      //  google.maps.event.clearListeners(self.ordinalMarker, 'click');
                        google.maps.event.removeListener(self.clickListener);

						self.clickListener = google.maps.event.addListener(self.marker || self.ordinalMarker, 'click', self.handleClick);
					},50);

				}
			}



			function handleClick(ev){
				//console.log('click on ' + self.AddressText);
				self.toggleSelected();
				self.changeCallback(self.dto);
			}
			
			function setIcon () {
				if (self.marker) {
					self.marker.setIcon(self.isSelected ? ux.png.mapMarker.selected : ux.png.mapMarker.unselected);
					self.marker.setMap(self.isShown ? parentCollection.mapObj : null);
				}
				if (self.ordinalMarker) {
					self.ordinalMarker.setIcon(ux.png.blank);
					self.ordinalMarker.setMap(self.isShown ? parentCollection.mapObj : null);
				}
			}

			function setOrdinal (value) {
				self.ordinal = value;
				self.refresh();
			}

			function toggleSelected () {
				self.setSelected(!self.isSelected);
			}

			function setSelected (setTo) {
				self.isSelected = setTo;
				parentCollection.updateIdLists();
				self.refresh();
			}

			function toggleShown () {
				self.setShown(!self.isShown);
			}

			function setShown (setTo) {
				self.isShown = setTo;
				self.isSelected = setTo && self.isSelected;
				self.refresh();
				parentCollection.updateIdLists();
			}

			return self;
		}

		return MapMarkerEntity;
	}
})();
