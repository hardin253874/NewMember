(function () {
    'use strict';

    var controllerId = 'insightsRentArrearsController';
    angular.module('app').controller(controllerId, ['$uibModal', 'seriesBuilder', 'statsServiceProxy', 'chartBuilder', '$scope', '$filter', createController]);

    function createController($uibModal, seriesBuilder, statsService, chartBuilder, $scope, $filter) {
        var vm = this;

        vm.updateMonthRange = updateMonthRange;
        vm.showDetail = showDetail;
        vm.showTenancyChart = showTenancyChart;
        vm.showInPercentage = showInPercentage;
        vm.showInTenants = showInTenants;
        vm.showEditSeriesModal = showEditSeriesModal;

        init();

        ////////////////////

        function init() {
            vm.initFrom = moment().subtract(1, 'month').format('YYYY-MM-DD');
            vm.initTo = moment().format('YYYY-MM-DD');
            vm.from = vm.initFrom;
            vm.to = vm.initTo;
            vm.inPercentage = true;
            vm.selectedDate = null;

            vm.chartDef = new chartBuilder()
                .enableTimeSeries()
                .setYAxisLabel('Tenants in arrears')
                .yAxisBeginAtZero()
                .formatYAxisTick(function (value) {
                    if (!vm.inPercentage) {
                        if (value % 1 === 0) { // Skip decimal value.
                            return value;
                        }
                    } else {
                        return $filter('patternNumber')(value, '#%');
                    }
                })
                .enableLegend()
                .enableTooltip();

            vm.chartSeries = [new seriesBuilder()
                .setDaysInArrears(3)
                .setSeriesColour(pmColours.Green)
                .setSeriesName('All portfolio, 3+ days')
            ];

            updateChartSeries();
        }

        function updateMonthRange(from, to) {
            vm.from = from;
            vm.to = to;
            if (vm.selectedDate > vm.from || vm.selectedDate < vm.to) {
                vm.selectedDate = null;
            }

            updateChartSeries();
        }

        function updateChartSeries() {
            vm.chartSeries.forEach(function (chartSeries) {
                chartSeries.setDataSource(function (filter) {
                    return statsService.getArrears(vm.from, vm.to, vm.inPercentage, filter.managerId, filter.daysInArrears);
                });
            });
            vm.chartSeries = vm.chartSeries.slice();
        }

        function showDetail(data) {
            console.log(data);
            vm.selectedDate = data.label;
        }

        function showTenancyChart(tenancyId, contactReference, lotReference) {
            $uibModal.open({
                component: 'pmcRentHistoryChart', resolve: {
                    from: function () {
                        return vm.from;
                    }, to: function () {
                        return vm.to;
                    }, tenancyId: function () {
                        return tenancyId;
                    }, contactReference: function () {
                        return contactReference;
                    }, lotReference: function () {
                        return lotReference;
                    }
                }
            });
        }

        function showInPercentage() {
            vm.inPercentage = true;
            updateChartSeries();
        }

        function showInTenants() {
            vm.inPercentage = false;
            updateChartSeries();
        }

        function showEditSeriesModal() {
            $uibModal.open({
                component: 'pmcEditSeries', resolve: {
                    chartSeries: function() {
                        return vm.chartSeries;
                    }
                }
            }).result.then(handleModalSuccess, handleModalDismiss);
        }

        function handleModalSuccess(series) {
            vm.chartSeries = series;
            updateChartSeries();
        }

        function handleModalDismiss(reason) {
            switch(reason.toLowerCase()) {
                case 'cancel' :
                    // nothing to do
                    break;
            }
        }
    }
})();