
(function () {
    'use strict';
    angular.module('app').service('inspectionPending', [createService ]);

    function createService () {
        var list = [], dueDate;

        function clearAll() {
            list = [];
        }
        function getAll() {
            return list;
        }
        function setAll(dt, l) {
            dueDate = dt;
            list = l;
        }
        function hasContentForDate(dt) {
            if (dt !== dueDate) return false;
            try {
                return !!list.length;
            } catch (e) {
                return false;
            }
        }

        return {
            get: getAll,
            set: setAll,
            clear: clearAll,
            hasContentForDate : hasContentForDate
        };


    }


})();
