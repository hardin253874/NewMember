(function () {
    'use strict';
    angular.module('app').service('taskService', ['server', taskService]);
    function taskService(server) {
        return {
            completeTask: completeTask,
            deleteTask: deleteTask
        };

        ///////////

        function completeTask(taskId) {
            var dto = {
                Id: taskId
            };
            return server.post('/api/entity/tasks/close/' + taskId, dto);
        }

        function deleteTask(taskId) {
            var dto = {
                Id: taskId
            };
            return server.post('/api/entity/tasks/delete/' + taskId, dto);
        }
    }
}());