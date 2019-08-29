(function () {
    'use strict';

    angular.module('app').controller('ownerInspectionReportController', ['$routeParams','$sce', '$scope', 'server', 'modalDetail', 'lightboxService', 'session', ownerInspectionReportController]);

    function ownerInspectionReportController($routeParams, $sce, $scope, server, modalDetail, lightboxPhoto, session) {
        var vm = this;
        vm.FolioId = $routeParams.folioId;
        vm.InspectionTaskId = $routeParams.id;
        vm.ownershipId = $routeParams.OwnershipId;
        vm.showDocumentInLightbox = showDocumentInLightbox;
        vm.showMoreDocuments = showMoreDocuments;
        vm.showedDocuments = [];

        init();

        ////////////

        function init() {
            server.verifyFolioId(vm.FolioId);

            vm.isEdgeOrIE = session.isEdgeOrIE();

            //InspectionReport info
            var url = 'portal/own/' + vm.FolioId + '/inspections/' + vm.InspectionTaskId + '/report?OwnershipId=' + vm.ownershipId;

            server.get(url).success(function (data) {
                vm.InspectionReport = data;
                //sort Areas by Number
                vm.InspectionReport.Areas.sort(function (a, b) { return a.Number - b.Number; });
                vm.InspectionReport.AreasToShow = vm.InspectionReport.Areas.filter(function (a) {return !a.IsDeleted && shouldAreaBeShown(a);});
                vm.InspectionReport.AreasToHide = vm.InspectionReport.Areas.filter(function (a) {return !a.IsDeleted && !shouldAreaBeShown(a);});

                function shouldAreaBeShown(area) {
                    return (area.Photos && !!area.Photos.length) || !!area.Note;
                }

            });

            server.getQuietly('portal/agent/' + vm.FolioId).success(function (data) {
                vm.Agent = data;
              if (vm.Agent && vm.Agent.LogoDocumentUrl && vm.Agent.LogoDocumentUrl.startsWith('/api')) {
                vm.Agent.LogoDocumentUrl = PM_SERVERROOT + vm.Agent.LogoDocumentUrl;
              }
            });

            server.getQuietly('portal/own/' + vm.FolioId + '/ownership/' + vm.ownershipId).success(function (data) {
                vm.folio = data;
            });

            getDocuments();

        }

        ////////////

        //////////// Documents

        function getDocuments() {

            var url = 'portal/own/' + vm.FolioId + '/inspections/' + vm.InspectionTaskId + '/documents?OwnershipId=' + vm.ownershipId;
            // Includes statements and documents directly linked to this owner. Excludes bills and photos.
            server.getQuietly(url).success(function (data) {
                vm.Documents = data.reverse();
                prepareDocuments();
                showMoreDocuments();
            });

        }

        function prepareDocuments() {
            vm.Documents.forEach(function(doc) {
                doc.isPhoto = (function isPhoto() {
                    var filetypes = 'JPEG PNG GIF JPG'.split(' ');
                    return doc.DocumentType ==='Photo' || filetypes.contains(doc.FileType);
                })();
            });
        }

        function showMoreDocuments(){
            //vm.showThisMany = vm.showThisMany + 3;
            //vm.showedDocuments = vm.Documents.first(vm.showThisMany);
            vm.showedDocuments = vm.Documents;
        }

        function showDocumentInLightbox(doc) {
            if (doc.isPhoto) {
                lightboxPhoto.show([preparePhotoForLightbox(doc)], 0);

            } else {
                lightboxHelper([preparePDFforLightbox(doc)], vm.isEdgeOrIE);
            }

        }

        function preparePhotoForLightbox(p) {
            return  {
                Id: p.Id,
                FileName: p.FileName,
                FileType: p.FileType,
                originalSrc: trustSrc(PM_SERVERROOT + '/api/portal/own/' + vm.FolioId + '/photos/' + p.Id + '?a=1'),
                bigSrc:  trustSrc(PM_SERVERROOT +'/api/portal/own/' +  vm.FolioId + '/photos/' + p.Id + '?size=L'),
                littleSrc:  trustSrc(PM_SERVERROOT + '/api/portal/own/' +  vm.FolioId + '/photos/' + p.Id + '?size=S')
            };

        }

        function preparePDFforLightbox(p) {
            return  {
                Id: p.Id,
                FileName: p.FileName,
                FileType: p.FileType,
                bigSrc:  trustSrc(PM_SERVERROOT +"/api/portal/own/" + p.FolioId + "/documents/" + p.Id + '?DocumentArea=InspectionReport')
            };
        }

        function lightboxHelper(listOfDocs, isIE) {
            var scope = {
                    list: listOfDocs,
                    selectedIndex: 0
                },
                modalOptions = {
                    className: isIE ? 'lightbox-modal-ie' : 'lightbox-modal lightbox-pdf '
                },
                template = isIE ? 'app/own/lightbox/lightbox-document-with-attachments-ie.html' :
                    'app/own/lightbox/lightbox-document-with-attachments.html';

            var modal = new modalDetail(template, scope);
            modal.scope(scope)
                .dismissable()
                .show(modalOptions);
        }

        // Strict Contextual Escaping (SCE) is a mode in which AngularJS requires bindings in certain contexts to result in a value that is marked as safe to use for that context.
        function trustSrc(src) {
            return $sce.trustAsResourceUrl(src);
        }


        ////////////

    }
})();
