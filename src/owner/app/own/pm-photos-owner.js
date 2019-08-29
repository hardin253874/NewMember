(function () {
    'use strict';
    var DIRECTIVE_ID = 'pmPhotosOwner';
    angular.module('app').directive(DIRECTIVE_ID, ['photoViewerCommon', myDirective]);

    function myDirective(photoViewerCommon) {

        //Used in the 'Owner' app

        var photoConfig = {
            getQueryUrl:  function (scope) {
                var url;
                if (scope.type === 'JobTask') {
                    url = '/api/portal/own/' +  scope.folioId + '/job/' + scope.id + '/photos?OwnershipId=';
                } else {
                    url = '/api/portal/own/' +  scope.id + '/photos?OwnershipId=';
                }

                if (angular.isDefined(scope.ownershipId)) {
                    url += scope.ownershipId;
                }

                if (angular.isDefined(scope.area)) {
                    url += '&DocumentArea=' + scope.area;
                }

                return url;

            },
            getPhotoUrl: function (scope, doc) {
                var url;

                if (scope.type === 'JobTask') {
                    url = PM_SERVERROOT + '/api/portal/own/' +  scope.folioId + '/photos/';
                } else {
                    url = PM_SERVERROOT + '/api/portal/own/' +  scope.id + '/photos/';
                }

                return url;
            },
            lightbox: {}
        };

        var myController = photoViewerCommon.createPhotoViewerController(photoConfig);

        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/owner/app/directives/photo/pm-photos.html',
            scope: {
                id: '=',
                type: '=',
                isEmpty: '=?',
                folioId: '=?',
                area: '=',
                ownershipId: '=?'
            },
            link: function (scope, containerElement, attrs, ctrl) {
                return;
            },
            controller: myController
        };


    }

})();
