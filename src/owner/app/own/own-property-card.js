(function () {
    'use strict';

    angular.module('app').controller('ownerPropertyCardController', ['$routeParams', '$scope', 'server', 'textFormat', 'permissionService', 'config', ownerPortalController]);

    function ownerPortalController($routeParams, $scope, server, textFormat, permissionService, config) {

        var vm = this;
        vm.currencySymbol = textFormat.currencySymbol;
        // this is the Folio Id
        vm.id = $routeParams.id;
        vm.ownershipId = $routeParams.OwnershipId;
        vm.hideBackButton = permissionService.folioAccessList.length === 1 &&
            (config ? config.ownerProperties : 0) <= 1;

        vm.showThisManyJobs = 3;
        vm.showThisManyInspections = 3;
        vm.showThisManyDocuments = 3;
        vm.currentMonth = null;
        vm.bingMapUrl = '';
        vm.isActiveOwner = false;
        init();

        ////////////

        function init() {
            server.verifyFolioId(vm.id);

            server.cacheGetQuietly('portal/agent/' + vm.id).success(function (data) {
                vm.Agent = data;
              if (vm.Agent && vm.Agent.LogoDocumentUrl) {
                if (vm.Agent.LogoDocumentUrl.endsWith('/public/')) {
                  // no logo document  exists
                  vm.Agent.LogoDocumentUrl = null;
                } else if (vm.Agent.LogoDocumentUrl.startsWith('/api')) {
                  vm.Agent.LogoDocumentUrl = PM_SERVERROOT + vm.Agent.LogoDocumentUrl;
                }
              }
            });

            server.getQuietly('portal/own/' + vm.id + '/ownership/' + vm.ownershipId).success(function (data) {
                vm.folio = data;
                vm.bingMapUrl = bingMapUrl(vm.folio.Lot.Address);
                initProperty();
                if (vm.folio && vm.folio.Lot && vm.ownershipId) {
                    vm.isActiveOwner = vm.folio.Lot.ActiveOwnershipId === vm.ownershipId;
                }
            });

            server.getQuietly('portal/own/' + vm.id + '/cashflow?OwnershipId=' + vm.ownershipId).success(function (data) {
                vm.IncomeExpense = {
                    list: data
                    };
                prepareIncomeExpenseChart();
            });
        }

        ////////////
        function initProperty() {
            vm.hidePhotos = true;
            $scope.$watch('vm.noPhotos', function(newVal, oldVal) {
                if (angular.isDefined(newVal)) {
                    vm.hidePhotos = newVal;
                }
            } );
        }

        function bingMapUrl(lotAddress) {
            //https://dev.virtualearth.net/REST/v1/Imagery/Map/road/{{vm.folio.Lot.Address.Latitude}},{{vm.folio.Lot.Address.Longitude}}/16?key={{vm.key}}&mapSize=900,900')

            var address = '';
            var pushpin = '';
            if (isValidPosition(lotAddress.Latitude, lotAddress.Longitude)) {
                address = lotAddress.Latitude + ',' + lotAddress.Longitude;
                pushpin = '&pushpin=' + lotAddress.Latitude + ',' + lotAddress.Longitude + ';113';
            }else {
                address = encodeURI(lotAddress.Text).replace('%0A', '%20');
            }

            return 'https://dev.virtualearth.net/REST/v1/Imagery/Map/road/' + address + '/16?key=' + BING_API_KEY +'&mapSize=900,900' + pushpin;
        }

        function isValidPosition(lat, long) {
            return !!lat && !!long &&
                lat >= -180 && lat <= 180 &&
                long >= -180 && long <= 180;
        }

        function prepareIncomeExpenseChart() {
            //This list can come back from the DB with missing months. Eg we might have values for December 2014, and then the next month is August 2014.
            //So we need to insert the missing months.

            var list = [];

            if (vm.IncomeExpense.list.length === 0) {
                //if there are no months at all, don't make the chart - there is nothing to show
                return;
            }

            if (vm.IncomeExpense.list.length === 1) {
                //if there is 1 month, don't do the consecutive check
                list = vm.IncomeExpense.list;
            } else {
                //Need to make sure all packets are consecutive - need to insert blanks for missing months
                var thisPacket, prevPacket;
                for (var i = vm.IncomeExpense.list.length-1; i > 0; i--) {
                     thisPacket = vm.IncomeExpense.list[i];
                     prevPacket = vm.IncomeExpense.list[i-1];

                    list.push(thisPacket);
                    var blank = thisPacket;
                    while (!isConsecutive(blank, prevPacket)) {
                        blank = blankMonthBefore(blank);
                        list.push(blank);
                    }
                }
                if (prevPacket) list.push(prevPacket);
            }

            //Make sure there is a minimum of 6
            while (list.length < 6) {
                list.push(blankMonthBefore(list.lastElement()));
            }

            //And a maximum of 12
            list = list.first(12);

            //Reverse it so that the last date is last
            list.reverse();

            vm.currentMonth = moment(list.lastElement().Month,'MM').format('MMMM') + ' ' + list.lastElement().Year;

            var income = list.map(function (ob, barIndex) {
                var aboveZero = ob.Credit;
                return [barIndex, aboveZero, 0];
            });
            var expenses = list.map(function (ob, barIndex) {
                var drop = -ob.Debit;
                return [barIndex, 0, drop];
            });
            var labels = list.map(function (ob, barIndex) {
                return moment(ob.Month,'MM').format('MMM') + '<BR>' + ob.Year;
            });

            vm.IncomeExpense.chart = {
                values: {
                    income: income, expenses: expenses
                }, labels: labels
            };

            function isConsecutive(thisPacket, prevPacket) {
                return (prevPacket.Month === thisPacket.Month - 1 && prevPacket.Year === thisPacket.Year) ||
                   (prevPacket.Month === 12 && thisPacket.Month === 1 && prevPacket.Year === thisPacket.Year - 1);
            }

            function blankMonthBefore(packet) {
                if (angular.isUndefined(packet)) {
                    //if the list was empty, start with a reference date of one month into the future, so then the first blank month
                    //will be this month
                    packet = {
                        Month : moment().add('months', 1).month(),
                            Year : moment().add('months', 1).year()
                    };

                }
                var month = packet.Month - 1, year = packet.Year;
                if (month === 0) {
                    month = 12;
                    year = year - 1;
                }
                return {
                    Expenses: 0,
                    Income: 0,
                    Month: month,
                    Year: year
                };
            }

        }
    }
})();
