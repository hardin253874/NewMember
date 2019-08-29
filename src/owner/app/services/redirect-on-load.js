
// This adds no value

//(function () {
//	'use strict';
//
//	angular.module('app').service('redirectOnLoad', ['$rootScope', '$location', 'permissionService', redirectOnLoad]);
//	function redirectOnLoad ($rootScope, $location, permissionService) {
//
//		var self = {
//			go: go
//		};
//
//		return self;
//
//		function go() {
//            $location.path('/default');
//            if ($rootScope.isAgent) {
//                $location.path('/portal/own/list');
//            } else {
//                $location.path('/dashboard/now');
//            }
//		}
//
//	}
//}());