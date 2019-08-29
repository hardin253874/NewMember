(function () {
    'use strict';

    angular.module('app').controller('ownerPropertyCardDocumentsController', ['$routeParams', '$sce',  'server',
        'modalDetail', 'lightboxService', 'session', myController]);

    function myController($routeParams,  $sce, server, modalDetail, lightboxPhoto, session) {
        var vm = this;
        vm.id = $routeParams.id;
        vm.ownershipId = $routeParams.OwnershipId;
        vm.showThisMany = 0;

        vm.showStatementInLightbox = showStatementInLightbox;
        vm.showDocumentInLightbox = showDocumentInLightbox;
        vm.showMoreDocuments = showMoreDocuments;
        vm.showedDocuments = [];

        init();

        ////////////

        function init() {
            server.verifyFolioId(vm.id);

            vm.isEdgeOrIE = session.isEdgeOrIE();

            // Includes statements and documents directly linked to this owner. Excludes bills and photos.
            server.getQuietly('portal/own/' + vm.id + '/documents?OwnershipId=' + vm.ownershipId).success(function (data) {
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
            vm.showThisMany = vm.showThisMany + 3;
            vm.showedDocuments = vm.Documents.first(vm.showThisMany);
        }

        function showStatementInLightbox(doc) {
                server.get('portal/own/' + doc.FolioId + '/statement-documents?StatementNumber=' + doc.StatementNumber)
                    .success(function (data) {
                        //this will have one document as the statement and then the remaining are the bills attached to that

                        var statement = data.getBy('Id', doc.Id),
                            rest = data.remove(statement);

                        var lightboxList = [statement].concat(rest).map(preparePDFforLightbox);
                        lightboxHelper(lightboxList, vm.isEdgeOrIE);
                    });

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
                originalSrc: trustSrc(PM_SERVERROOT + '/api/portal/own/' +  vm.id + '/photos/' + p.Id + '?a=1'),
                bigSrc:  trustSrc(PM_SERVERROOT +'/api/portal/own/' +  vm.id + '/photos/' + p.Id + '?size=L'),
                littleSrc:  trustSrc(PM_SERVERROOT + '/api/portal/own/' +  vm.id + '/photos/' + p.Id + '?size=S')
            };

        }

        function preparePDFforLightbox(p) {
            return  {
                Id: p.Id,
                FileName: p.FileName,
                FileType: p.FileType,
                bigSrc:  trustSrc(PM_SERVERROOT +"/api/portal/own/" + p.FolioId + "/documents/" + p.Id + '?DocumentArea=Ownership')
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


    }
})();
