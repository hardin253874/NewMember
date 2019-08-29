(function () {
    'use strict';

    angular.module('app').controller('ownerJobCardBillsController', ['$routeParams', '$sce', 'server',
        'modalDetail', 'lightboxService', 'ux', 'session', myController]);

    function myController($routeParams, $sce,   server, modalDetail, lightboxPhoto, ux, session) {
        var vm = this;
        vm.id = $routeParams.id;
        vm.folioId = $routeParams.folioId;
        vm.showDocumentInLightbox = showDocumentInLightbox;

        vm.bills = [];

        init();

        ////////////

        function init() {
            server.verifyFolioId(vm.folioId);

            vm.isEdgeOrIE = session.isEdgeOrIE();

            // Includes statements and documents directly linked to this owner. Excludes bills and photos.
            server.getQuietly('portal/own/' + $routeParams.folioId + '/job/bills?JobTaskId=' + vm.id).success(function (data) {
                var bills = data.map(function(billLink){
                    var info = ' Bill #' + billLink.BillNumber + ' processed on ' + ux.textFormat.dateText(billLink.BillCreatedOn) ;
                    //info +=  ', payment to ' + billLink.SupplierContactReference;
                    if(billLink.BillDetail && billLink.BillDetail.length > 0) {
                        info += ' with details of ' + billLink.BillDetail;
                    }
                    info += ' for ' +  ux.textFormat.currency(billLink.BillAmount) ;

                    billLink.info = info;
                    return billLink;
                });

                vm.bills = bills;
                prepareDocuments();
            });
        }

        function prepareDocuments() {
            vm.bills.forEach(function(doc) {
                doc.isPhoto = (function isPhoto() {
                    var filetypes = 'JPEG PNG GIF JPG'.split(' ');
                    return doc.DocumentType ==='Photo' || filetypes.contains(doc.FileType);
                })();
            });
        }

        function showDocumentInLightbox(doc) {
            if (doc.isPhoto) {
                lightboxPhoto.show([preparePhotoForLightbox(doc)], 0);

            } else {
                var isEdgeOrIE = session.isEdgeOrIE();
                lightboxHelper([preparePDFforLightbox(doc)], isEdgeOrIE);
            }
        }

        function preparePhotoForLightbox(p) {

            var folioId = p.FolioId ? p.FolioId : vm.folioId;

            return  {
                Id: p.Id,
                FileName: p.FileName,
                FileType: p.FileType,
                bigSrc: trustSrc(PM_SERVERROOT +'/api/portal/own/' +  folioId + '/photos/' + p.Id + '?size=L'),
                littleSrc: trustSrc(PM_SERVERROOT +'/api/portal/own/' + folioId + '/photos/' + p.Id + '?size=S')
            };

        }

        function preparePDFforLightbox(p) {

            var folioId = p.FolioId ? p.FolioId : vm.folioId;

            return  {
                Id: p.Id,
                FileName: p.FileName,
                FileType: p.FileType,
                bigSrc: trustSrc(PM_SERVERROOT + "/api/portal/own/" + folioId + "/documents/" + p.Id)
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
