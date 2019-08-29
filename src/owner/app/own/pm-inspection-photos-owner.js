(function () {
    'use strict';

    angular.module('app').directive('pmInspectionPhotosOwner', ['$timeout', 'photoViewerCommon', directive]);

    function directive($timeout, photoViewerCommon) {

        //Used in the Owner portal
        var photoConfig = {
            getPhotoUrl: function (scope) {
                return PM_SERVERROOT + '/api/portal/own/' +  scope.folioId + '/photos/';
            },
            lightbox: {}
        };

        var myController = photoViewerCommon.createInspectionReportViewerController(photoConfig);

        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/owner/app/own/pm-inspection-photos-owner.html',
            scope: {
                list: '=',
                folioId: '='
            },
            link: function (scope) {
                if (!_.isEmpty(scope.list)) {
                    var newList = scope.list.filter(function(elem) {
                        return !elem.IsDeleted;
                    });

                    $timeout(function() {
                        scope.list = newList;
                    });
                }
            },
            controller: myController
        };
    }
})();
