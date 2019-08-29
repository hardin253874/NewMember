(function () {
	'use strict';
	angular.module('app').service('disburseService', ['$rootScope', '$timeout', 'server','ux', service]);

    function service ($rootScope, $timeout, server, ux) {
        var svc = this;

        var apiUrl = '/api/financial/disbursements';

        svc.disburse = disburse;
        //svc.disburseAllDueOwnerFolios = disburseAllDueOwnerFolios;
        svc.status = {
            isDisbursing: false
        };

        svc.disburseSingleFolio= disburseSingleFolio;

		return svc;

        function disburseSingleFolio(folio, callback) {
            if (folio.DisburseFrequency === 'Manual') {
                disburseSingleFolioCore(folio, callback);
            } else {
                var message = 'Are you sure you want to disburse ' + folio.ContactReference + ' (' + folio.Code + ') now?<br/><br/>This disbursement will not move the Next Disbursement Date forward for this owner, you can move this forward manually if you like.';

                ux.modal.confirm(message, function (confirmed) {
                        if (confirmed) {
                            disburseSingleFolioCore(folio, callback);
                        }
                    }
                );
            }
        }

        function disburseSingleFolioCore(folio, callback) {
            if (!svc.status.isDisbursing) {
                svc.status.isDisbursing = true;
                broadcast();
                var dto = {FolioId: folio.Id};
                server.post(getDisburseFolioServiceUrl(folio), dto).success(function (response) {
                        svc.status.isDisbursing = false;
                        broadcast();
                        ux.refreshData();
                        ux.alert.response(response, 'Disburse ' + folio.Type);
                        if (callback) {
                            callback();
                        }
                    }
                );
            }
        }

        function getDisburseFolioServiceUrl (folio){
            var folioType = folio.Type.toLowerCase();
            return apiUrl + '/' + folioType;
        }

        function disburse(dto, callback) {
            disburseBatchFolios('bulk', dto, callback);
        }

        function disburseBatchFolios(lastPath, dto, callback) {

            if (!svc.status.isDisbursing) {
                svc.status.isDisbursing = true;
                broadcast();
                server.post(apiUrl +'/' + lastPath, dto).success(function (response) {
                    svc.status.isDisbursing = false;
                    broadcast();
                    if(callback) {
                        callback();
                    }
                });
            }
        }

        function broadcast() {
            var message = 'status:disbursed';
            $rootScope.$broadcast(message, svc.status);
        }

    }
}());