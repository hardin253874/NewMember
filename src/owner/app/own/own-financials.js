(function () {
    'use strict';

    angular.module('app').controller('ownerFinancialsController', ['$routeParams', '$scope', 'server', 'ux', controller]);

    function controller($routeParams, $scope, server, ux) {
        var vm = this;
        vm.FolioId = $routeParams.folioId;
        vm.ownershipId = $routeParams.OwnershipId;
        var apiUrl = 'portal/own/' + vm.FolioId + '/financial/summary';

        var dateFormat = 'YYYY-MM-DD';
        vm.periodMinDate = moment().subtract(2, 'year').startOf('month').format(dateFormat);
        vm.periodMaxDate = moment().add(2, 'year').endOf('month').format(dateFormat);


        // fiscal settings hardcoded for now
        var fiscalStartMonth = 6; // July: 0 based numbering
        var fiscalEndMonth = 5; // June

        vm.expenseValues = {};
        vm.incomeValues = {};
        vm.ownerships = [];
        vm.showOwnershipId = '';
        vm.colours = {
            income: pmColours.chartColourSet_Income,
            expenses: pmColours.chartColourSet_Expenses
        };
        vm.displayMonth = displayMonth;
        init();

        ////////////

        function init() {
            server.verifyFolioId(vm.FolioId);

            setInitialPeriod();

            loadData();

            $scope.$watch('vm.periodStartDate', function(newVal, oldVal){
                if (newVal !== oldVal) {
                    loadData();
                }
            } );
            $scope.$watch('vm.periodEndDate', function(newVal, oldVal){
                if (newVal !== oldVal) {
                    loadData();
                }
            } );
            $scope.$watch('vm.showOwnershipId', function(newVal, oldVal){
                if (newVal !== oldVal) {
                    loadData();
                }
            } );
        }

        function loadData() {
            validPeriodRange();
            buildApiUrl();
            loadOwnershipsForFolio(vm.FolioId);
            // get financial summary
            server.getQuietly(apiUrl).success(function (data) {
                vm.chartAccounts = data.aaData || data;
                calculateTotals(vm.chartAccounts);
                prepareChartValues(vm.chartAccounts);
            });

            server.getQuietly('portal/own/' + vm.FolioId + '/cashflow?OwnershipId=' + vm.showOwnershipId + '&PeriodStart=' + vm.periodStartDate + '&PeriodEnd=' + vm.periodEndDate).success(function (data) {
                vm.IncomeExpense = {
                    list: data
                };
                prepareIncomeExpenseChart();
            });
        }

        function buildApiUrl() {
            apiUrl = 'portal/own/' + vm.FolioId + '/financial/summary?OwnershipId=' + vm.showOwnershipId + '&PeriodStart=' + vm.periodStartDate + '&PeriodEnd=' + vm.periodEndDate;
        }

        function calculateTotals(aaData) {
            vm.taxTotal = 0;
            vm.creditTotal = 0;
            vm.debitTotal = 0;

            for (var i = 0; i < aaData.length; i++) {
                vm.creditTotal += aaData[i].Credit;
                vm.debitTotal += aaData[i].Debit;
                vm.taxTotal += aaData[i].TaxIncluded;
            }
        }

        function setInitialPeriod() {
            setPeriodToLastYear();
        }

        function setPeriodToLastYear() {
            vm.periodStartDate = moment().subtract(1, 'year').startOf('month').format(dateFormat);
            vm.periodEndDate = moment().endOf('month').format(dateFormat);
        }

        function validPeriodRange() {
            // to valid the periodStartDate and periodEndDate
            var startDate = moment(vm.periodStartDate, dateFormat);
            if (!startDate.isValid()) {
                vm.periodStartDate = moment().subtract(1, 'year').startOf('month').format(dateFormat);
            }

            var endDate = moment(vm.periodEndDate, dateFormat);
            if (!endDate.isValid()) {
                vm.periodEndDate = moment().endOf('month').format(dateFormat);
            }

            //if period startdate and enddate in process range
            if (vm.periodStartDate <= vm.periodMinDate || vm.periodStartDate > vm.periodMaxDate){
                vm.periodStartDate = moment().subtract(1, 'year').startOf('month').format(dateFormat);
            }

            if (vm.periodEndDate <= vm.periodMinDate || vm.periodEndDate > vm.periodMaxDate){
                vm.periodEndDate = moment().endOf('month').format(dateFormat);
            }

            //if period enddate is less than period startdate
            if (vm.periodEndDate <= vm.periodStartDate){
                vm.periodEndDate = moment().endOf('month').format(dateFormat);
            }
        }

        function setFiscalYearRange() {
            if (moment().quarter() > 2) {
                vm.periodStartDate = moment().month(fiscalStartMonth).startOf('month').format(dateFormat);
                vm.periodEndDate = moment().add('year', 1).month(fiscalEndMonth).endOf('month').format(dateFormat);
            } else {
                vm.periodStartDate = moment().subtract(1, 'year').month(fiscalStartMonth).startOf('month').format(dateFormat);
                vm.periodEndDate = moment().month(fiscalEndMonth).endOf('month').format(dateFormat);
            }
        }

        function prepareChartValues(aaData) {
            vm.expenseValues = {};
            vm.incomeValues = {};

            for (var i = 0; i < aaData.length; i++) {
                var chartAccountName = aaData[i].ChartAccountName;
                // we only want expenses
                var debitAmount = aaData[i].Debit;
                var creditAmount = aaData[i].Credit;
                if (debitAmount > 0) {
                    vm.expenseValues[chartAccountName] = debitAmount;
                }
                if (creditAmount > 0) {
                    vm.incomeValues[chartAccountName] = creditAmount;
                }
            }
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
            //list = list.first(12);

            //Reverse it so that the last date is last
            list.reverse();

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

        function loadOwnershipsForFolio(folioId) {
            server
                .get('portal/own/' + folioId + '/ownerships/list')
                .success(function (list) {
                    vm.ownerships = new ux.lookupAdaptor(list, ux.lookupAdaptor.useLabel).lookup;
                    vm.ownerships.unshift({id:'', label:'All Properties', template:'All Properties', filter:'All Properties'});
                });
        }

        function displayMonth(chartAccount) {
            return moment(chartAccount.Month).format('MMM YYYY');
        }
    }
})();
