(function () {
	'use strict';
	angular.module('app').factory('mapMarkerCollection', ['libraryLoader',
		'mapMarkerEntity',
		factory]);
	function factory ( libraryLoader, mapMarkerEntity) {
		function _factory (callback) {
			var self = this;
			self.items = [];
			self.lastUpdatedAt = null;
            self.afterInitialised = callback || function(){};

			var mapObj = null;
			var isWaitingforDependencies = true;
			self.setMap = setMap;
			self.filter = filter;
			self.updateIdLists = updateIdLists;
			self.selectedIds = [];
			self.selectedItems = [];
			self.unselectedItems = [];
			self.unMappableItems = [];
			self.mappableItems = [];
			self.shownIds = [];
			self.clear = clear;
			self.empty = empty;
			self.refresh = refresh;
			self.setChangeCallbacks = setChangeCallbacks;
            self.getById = getById;
			self.addProperty = addProperty;
			self.addProperties = addProperties;
			self.refreshCluster = refreshCluster;


			//init
			libraryLoader.GoogleMaps.load()
				.then(libraryLoader.MarkerWithLabel.load)
				.then(libraryLoader.MarkerClusterer.load)
				.then(function (res) {
					init();
				});

			function init () {
				isWaitingforDependencies = false;
				if (self.futureMap) {
					setMap(self.futureMap);
				}
				itemsUpdated();
				self.afterInitialised.call(window);


			}

			function setMap(map) {
				if (isWaitingforDependencies) {
					self.futureMap = map;
					return;
				}
				mapObj = map;
				initClusters();
			}

			function initClusters() {
				self.markerClustererSelected = new MarkerClusterer(mapObj, null, {
					averageCenter: true,
					zoomOnClick: false,
					styles: [
						{url: 'app/content/images/maps/cluster-blue.png',
							height: 52,
							width: 53,
							anchor: [-8, 0],
							textColor: '#ffffff',
							textSize: 18}
					]
				});
				self.markerClustererUnSelected = new MarkerClusterer(mapObj, null, {
					averageCenter: true,
					zoomOnClick: false,
					styles: [
						{url: 'app/content/images/maps/cluster-black.png',
							height: 52,
							width: 53,
							anchor: [-8, 0],
							textColor: '#ffffff',
							textSize: 18
						}
					]
				});

				//add handlers for click events
				google.maps.event.addListener(self.markerClustererSelected, 'clusterclick', unSelectCluster);
				google.maps.event.addListener(self.markerClustererUnSelected, 'clusterclick', selectCluster);
			}

			function itemsUpdated() {
				//means items have been added
				self.lastUpdatedAt = (new Date().getTime());

			}

			function filter (filterFn) {
				self.items.forEach(function (item) {
					item.setShown(
						filterFn(item.dto)
					);
				});
			}

			function updateIdLists () {
				self.selectedItems = [];
				self.unselectedItems = [];
				self.shownIds = [];
				self.mappableItems = [];
				self.unMappableItems = [];
				for (var i = self.items.length - 1; i >= 0; i--) {
					var item = self.items[i];
					if (item.isMappable) {
						self.mappableItems.push(item);
						if (item.isSelected) {
							self.selectedItems.push(item);
						}
						else {
							self.unselectedItems.push(item);
						}
						if (item.isShown) {
							self.shownIds.push(item.Id);
						}
					}
					else {
						self.unMappableItems.push(item);
					}
				}
				self.selectedIds = self.selectedItems.map(function (x) {
					return x.Id;
				});
				refreshCluster();

			}

			function refresh () {
					self.items.forEach(function (item) {
						if (item.isMappable) {
							item.refresh();
						}
					});

				if (self.markerClustererUnSelected) {
					self.markerClustererUnSelected.redraw();
				}
				if (self.markerClustererSelected) {
					self.markerClustererSelected.redraw();
				}


			}

			function clear () {
				self.items.forEach(function (item) {
					if (item.marker) {
						item.marker.setMap(null);
					}
					if (item.ordinalMarker) {
						item.ordinalMarker.setMap(null);
					}
				});
			}
			function empty () {
				clear();
				self.items = [];
			}

			function setChangeCallbacks (callback) {
				self.items.forEach(function (item) {
					item.changeCallback = callback;
				});
			}

            function getById(id) {
                //need to look at the dto of each map marker entity
                var f =  self.items.filter(function(item) {
                    return item.dto.Id === id;
                });
                if (f.length) {
                    return f[0];
                } else {
                    return undefined;
                }
            }

			function refreshCluster() {
				if (self.markerClustererUnSelected) {
					fn(self.markerClustererUnSelected, self.unselectedItems);
				}
				if (self.markerClustererSelected) {
					fn(self.markerClustererSelected, self.selectedItems);
				}

				function fn (mC, list) {

					mC.clearMarkers();
					list.forEach(function (item) {
						if (item.marker) {
							item.marker.setMap(null);
						}

					});
					var mks = list.map(function (x) {
						return x.marker;
					});
					mC.addMarkers(mks);
					mC.redraw();
				}
			}

			function addProperties(listOfProperties) {
				listOfProperties.forEach(function(item) {
					var mk = new mapMarkerEntity(item, self);
					self.items.push(mk );
				});
				updateIdLists();
				itemsUpdated();

			}

			function addProperty(prop) {
				var mk = new mapMarkerEntity(prop, self);
				self.items.push(mk);
				updateIdLists();
				itemsUpdated();
				return mk;
			}

			function selectCluster(event) {
				var ids = getLotsFromClusterClick(event);
				for (var i = 0; i < ids.length ; i ++) {
					var m = getById(ids[i]);
					self.markerClustererUnSelected.removeMarker(m.marker);
					self.markerClustererSelected.addMarker(m.marker);
					m.setSelected(true);
					m.changeCallback(m.dto);
				}
				updateIdLists();
			}
			function unSelectCluster(event) {
				var ids = getLotsFromClusterClick(event);
				for (var i = 0; i < ids.length ; i ++) {
					var m = getById(ids[i]);
					self.markerClustererUnSelected.addMarker(m.marker);
					self.markerClustererSelected.removeMarker(m.marker);
					m.setSelected(false);
					m.changeCallback(m.dto);
				}
				updateIdLists();
			}

			function getLotsFromClusterClick(event) {
				var ids = [];
				var ms = event.getMarkers();
				for (var i = 0; i < ms.length ; i ++) {
					ids.push(ms[i]._PropertyMeData.dto.Id);
				}
				return ids;
			}

		}

		_factory.isMappableProperty = function(prop) {
			var p = prop;

			var mk =  new mapMarkerEntity(p);
			return mk.isMappable;
		};
		return _factory;
	}
})();