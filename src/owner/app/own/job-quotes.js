(function () {
    'use strict';

    angular.module('app').controller('ownerJobCardQuotesController', ['$routeParams', '$sce', 'server',
        'modalDetail', 'lightboxService', 'ux', 'session', myController]);

    function myController($routeParams, $sce,  server, modalDetail, lightboxPhoto, ux, session) {
        var vm = this;
        vm.id = $routeParams.id;
        vm.folioId = $routeParams.folioId;
        vm.showDocumentInLightbox = showDocumentInLightbox;
        vm.quotes = [];

        init();

        ////////////

        function init() {
            server.verifyFolioId(vm.folioId);

            vm.isEdgeOrIE = session.isEdgeOrIE();

            // Includes statements and documents directly linked to this owner. Excludes bills and photos.
            server.getQuietly('portal/own/' + vm.folioId + '/job/quotes?JobTaskId=' + vm.id).success(function (data) {

                if (data) {
                    vm.quotes  = data.map(function(quote){
                        quote.amountInfo = (quote.Amount && quote.Amount > 0) ? ux.textFormat.currency(quote.Amount) : null;
                        quote.dateInfo = ux.textFormat.dateText(quote.QuotedOn);
                        quote.quoteInfo = quote.SupplierReference;
                        return quote;
                    });
                }


            });
        }

        function prepareDocuments() {
            vm.quotes.forEach(function(doc) {
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
                lightboxHelper([preparePDFforLightbox(doc)], vm.isEdgeOrIE);
            }
        }

        function preparePhotoForLightbox(p) {
            return  {
                Id: p.Id,
                FileName: p.FileName,
                FileType: p.FileType,
                bigSrc: trustSrc(PM_SERVERROOT + '/api/portal/own/' +  p.FolioId + '/photos/' + p.Id + '?size=L&DocumentArea=JobQuotation'),
                littleSrc:trustSrc(PM_SERVERROOT + '/api/portal/own/' + p.FolioId + '/photos/' + p.Id + '?size=S&DocumentArea=JobQuotation')
            };

        }

        function preparePDFforLightbox(p) {
            return  {
                Id: p.Id,
                FileName: p.FileName,
                FileType: p.FileType,
                bigSrc:trustSrc(PM_SERVERROOT + "/api/portal/own/" + p.FolioId + "/documents/" + p.Id + '?DocumentArea=JobQuotation')
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
