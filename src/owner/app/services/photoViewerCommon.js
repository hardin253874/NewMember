(function () {
    'use strict';
    angular.module('app').service('photoViewerCommon', ['$timeout', 'server', 'config', 'ux', 'lightboxService',  myService]);
    function myService($timeout, server, config, ux, lightbox) {

        var common = {

            clear: function (scope) {
                scope.mainPhoto = null;
                scope.prevPhoto = null;
                scope.nextPhoto = null;
            },

            setPhotos: function (index, scope) {
                var h, i, j, ls = scope.list;
                if (index >= 0) {
                    scope.selectedIndex = index;
                }
                i = scope.selectedIndex;

                if (i === 0) {
                    h = ls.length - 1;
                } else {
                    h = i - 1;
                }
                if (i === ls.length - 1) {
                    j = 0;
                } else {
                    j = i + 1;
                }

                //scope.mainPhoto = scope.list[i];
                scope.prevPhoto = i === h ? null : scope.list[h];
                scope.nextPhoto = i === j ? null : scope.list[j];

                //make sure the image loads
                var tmp = scope.list[i];
                scope.mainPhoto = null;
                scope.isLoading = true;
                scope.isEmpty = false;
                //Do preload with the same image we are showing as main photo - in this case getLittleSrc
                ux.preloadImage(scope.getLittleSrc(tmp), function(success) {
                    scope.isLoading = false;
                    if (success) {
                        scope.mainPhoto = tmp;
                    }
                    scope.showThumbnails = (scope.list.length > 1);
                    $timeout(function() {
                        scope.$apply();
                    });
                });
            },

            shuffle: function(direction, scope) {
                scope.selectedIndex += direction;
                if (scope.selectedIndex >= scope.list.length ) {
                    scope.selectedIndex = 0;
                }
                if (scope.selectedIndex < 0 ) {
                    scope.selectedIndex =  scope.list.length-1;
                }
                common.setPhotos(scope.selectedIndex, scope);
            },
            isValidPhoto: function(p) {
                if (!p) return false;
                var id = p.Id || p.DocumentStorageId;
                return id && id !== server.dtoFactory.emptyGuid && !p.IsDeleted;
            },
            validMainPhoto: function(scope) {
                return common.isValidPhoto(scope.mainPhoto);
            },
            deletePhoto: function (photo, callback) {
                console.log('photocommon delete function');

                ux.modal.confirm('Are you sure you want to delete this photo?<BR><b>' + (photo.FileName || '') + '</b>', function (confirmed) {
                    if (confirmed) {
                        server.post('/api/storage/documents/delete', {Ids: [photo.Id]}).success(function (res) {
                            ux.alert.success(photo.FileName + ' deleted.');
                            callback();
                        });
                    }
                });
            }
        };


        return {
            createPhotoViewerController: createPhotoViewerController,
            createInspectionReportViewerController: createInspectionReportViewerController
        };

        function createPhotoViewerController (photoConfig ) {

            controller.$inject = ['$scope'];
            return controller;
            function controller(scope) {

                scope.list = [];
                scope.getLittleSrc = getLittleSrc;
                scope.getBigSrc = getBigSrc;
                scope.validMainPhoto = function() {return common.validMainPhoto(scope);};
                scope.next = function(){common.shuffle(1, scope );};
                scope.prev = function(){common.shuffle(-1, scope );};
                scope.deletePhoto = function(photo) {common.deletePhoto(photo, refresh);};

                scope.lightbox = showLightbox;

                scope.$watch('id', refresh);
                scope.$on(config.events.refreshData, refresh);

                function refresh() {
                    if (scope.id) {
                        server.getQuietly(photoConfig.getQueryUrl(scope)).success(function (data) {
                                common.clear(scope);
                                scope.list = prepare(data);
                                scope.isEmpty = !scope.list.length || scope.list.length === 0;
                                if (!scope.isEmpty) {
                                    common.setPhotos(0,scope);
                                }
                            }).error(function () {
                                scope.isEmpty = true;
                            });
                    }
                }

                function prepare(raw) {
                    var list;
                    if (raw.aaData) {
                        list = raw.aaData;
                    } else {
                        list = raw;
                    }
                    list = filterImages(list);
                    return list;
                }

                function filterImages(list) {
                    var imgs = 'PNG JPEG JPG GIF'.split(' ');
                    return list.filter(function (x) {
                        return imgs.contains(x.FileType);
                    });
                }

                function getLittleSrc(doc) {
                    if (!doc) return '';
                    return photoConfig.getPhotoUrl(scope,  doc) + doc.Id + '?size=S';
                }

                function getBigSrc(doc) {
                    if (!doc) return '';
                    return photoConfig.getPhotoUrl(scope,  doc) + doc.Id + '?size=L';
                }


                function getOriginalSrc(doc) {
                    if (!doc) {
                        return '';
                    } else {
                        return photoConfig.getPhotoUrl(scope,  doc) + doc.Id + '?a=1';
                    }
                }

                function showLightbox() {
                    if (!scope.isEmpty) {
                        var lightboxList = scope.list.map(function(p) {
                            if (common.isValidPhoto(p)) {
                                return makeLightBoxPhoto(p);
                            }
                        }).filter(function(p) {return !!p;}); //remove the blanks
                        //find new selectedIndex value based on the fitlered list
                        var index = lightboxList.getIndexOf('Id', scope.mainPhoto.Id || scope.mainPhoto.DocumentStorageId );
                        lightbox.show(lightboxList, index, photoConfig.lightbox.deleteHelper,photoConfig.lightbox.reorderHelper);
                    }
                }

                function makeLightBoxPhoto(p) {
                    return  {
                        Id: p.DocumentStorageId || p.Id,
                        FileType: p.FileType,
                        FileName: p.FileName,
                        originalSrc: getOriginalSrc(p),
                        bigSrc: getBigSrc(p),
                        littleSrc: getLittleSrc(p)
                    };
                }

            }
        }

        function createInspectionReportViewerController (photoConfig ) {
            controller.$inject = ['$scope', '$element'];
            return controller;

            function controller(scope, element) {

                scope.getLittleSrc = getLittleSrc;
                scope.getBigSrc = getBigSrc;
                scope.validMainPhoto = function() {return common.validMainPhoto(scope);};
                scope.next = function(){common.shuffle(1, scope );};
                scope.prev = function(){common.shuffle(-1, scope );};
                scope.setPhoto = function(index) {common.setPhotos(index, scope);};
                scope.deletePhoto = function(photo) {common.deletePhoto(photo, refresh);};
                scope.deletePhotoLink = deletePhotoLink;
                scope.showThumbnails = false;
                scope.scrollThumbnails = scrollThumbnails;
                scope.lightbox = showLightbox;

                //special Notes lines
                scope.showNotes = true;
                scope.getNote = getNoteForPhoto;

                scope.$watch('list', refresh);
                scope.$on(config.events.refreshData, refresh);
                scope.$on(config.events.recalcData, refresh);

                var thumbnailScrollingPanel;
                $timeout(handleScrollingOfThumbnails,100); //wait for DOM to be available

                function refresh() {
                    if (scope.list && scope.list.length) {
                        common.setPhotos(0, scope);
                    } else {
                        scope.isEmpty = true;
                        common.clear(scope);
                    }
                }

                function getLittleSrc(doc) {
                    if (!doc) {
                        return '';
                    } else {
                        return photoConfig.getPhotoUrl(scope) + doc.DocumentStorageId + '?size=S';
                    }
                }

                function getBigSrc(doc) {
                    if (!doc) {
                        return '';
                    } else {
                        return photoConfig.getPhotoUrl(scope) + doc.DocumentStorageId + '?size=L';
                    }
                }

                function getOriginalSrc(doc) {
                    if (!doc) {
                        return '';
                    } else {
                        return photoConfig.getPhotoUrl(scope) + doc.DocumentStorageId + '?a=1';
                    }
                }

                function deletePhotoLink() {
                    // remove the photo from the list
                    scope.list[scope.selectedIndex].IsDeleted = true;
                    scope.list.splice(scope.selectedIndex, 1);
                    refresh();
                }

                function showLightbox() {
                    if(scope.mainPhoto) {
                        var lightboxList = scope.list.map(function(p) {
                            if (common.isValidPhoto(p)) {
                                return makeLightBoxPhoto(p);
                            }
                        }).filter(function(p) {return !!p;}); //remove the blanks

                        //find new selectedIndex value based on the filtered list
                        var index = lightboxList.getIndexOf('Id', scope.mainPhoto.Id || scope.mainPhoto.DocumentStorageId );
                        lightbox.show(lightboxList, index, photoConfig.lightbox.deleteHelper, photoConfig.lightbox.reorderHelper);
                    }
                }

                function makeLightBoxPhoto(p) {
                    return  {
                        originalPhoto: p,
                        Id: p.DocumentStorageId || p.Id,
                        FileType: p.FileType,
                        FileName: p.FileName,
                        originalSrc: getOriginalSrc(p),
                        bigSrc: getBigSrc(p),
                        littleSrc: getLittleSrc(p)
                    };
                }

                /////// Notes

                function getNoteForPhoto(photo) {
                    return photo ? photo.Note : null ;
                }

                /////////////
                function  handleScrollingOfThumbnails () {
                    if (scope.showThumbnails) {
                        thumbnailScrollingPanel = element.find('#photo-thumbnail-scrolling-panel');

                        $(window).resize(refreshScrollers);
                        thumbnailScrollingPanel.on('scroll', refreshScrollers);
                        refreshScrollers();
                    }

                    function refreshScrollers() {
                        var panel = thumbnailScrollingPanel[0];
                        if (panel.offsetHeight <= panel.scrollHeight) {
                            //scrolling is required
                            //+10 is because sometimes you can scroll to the edge, but it registers as scrollTop: 99, offsetHeight: 400, scrollHeight: 500
                            scope.isThumbnailsScrollableDown = panel.scrollTop + panel.offsetHeight + 10 < panel.scrollHeight;
                            scope.isThumbnailsScrollableUp = panel.scrollTop > 0;
                        } else {
                            //no scrolling required
                            scope.isThumbnailsScrollableDown = false;
                            scope.isThumbnailsScrollableUp = false;
                        }
                    }

                }

                function scrollThumbnails(direction) {
                    var delta = 50;
                    thumbnailScrollingPanel[0].scrollTop += Number(direction) * delta;
                }
            }
        }

    }

})();