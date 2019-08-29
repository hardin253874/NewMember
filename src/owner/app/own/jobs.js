(function () {
    'use strict';

    angular.module('app').controller('ownerPropertyCardJobsController', ['$routeParams',  'server', myController]);

    function myController($routeParams,  server) {
        var vm = this;
        vm.id = $routeParams.id;
        vm.ownershipId = $routeParams.OwnershipId;
        vm.showThisMany = 3;

        init();

        ////////////

        function init() {
            server.verifyFolioId(vm.id);

            server.getQuietly('portal/own/' + vm.id + '/jobs/?OwnershipId=' + vm.ownershipId).success(function (data) {
                vm.Jobs = data.aaData || data;
                prepareJobs();
                vm.showJobs = true;
            });

        }

        ////////////

        function prepareJobs() {
            //show ALL the active jobs by default, and show at least 3;
            vm.showThisMany = Math.max(3, vm.Jobs.countIf(function(j) {return !j.ClosedOn;} ));

            vm.Jobs.forEach(function(job) {
                if (job.ClosedOn) {
                    job.DateToShow = job.ClosedOn;
                    job.DateToShowMsg = 'Finished on';
                } else {
                    job.DateToShow = job.CreatedOn;
                    job.DateToShowMsg = 'Reported on';
                }
            });

            vm.Jobs.sort(function(a,b) {
                if (!a.ClosedOn && !b.ClosedOn )  {
                    //both open, compare reported date
                    return moment(b.CreatedOn).diff(moment(a.CreatedOn), 'mins');
                }
                if (a.ClosedOn && !b.ClosedOn )  {
                    //b still open
                    return 1;
                }
                if (!a.ClosedOn && b.ClosedOn )  {
                    //a still open
                    return -1;
                }

                if (a.ClosedOn && b.ClosedOn )  {
                    return moment(b.ClosedOn).diff(moment(a.ClosedOn), 'mins');
                }


            });
        }



    }
})();
