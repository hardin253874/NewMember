(function () {
    'use strict';
    angular.module('app').service('messageService', ['server', messageService]);
    function messageService(server) {
        return {
            sendEmail: sendEmail,
            deleteMessage: deleteMessage,
            deleteMessages: deleteMessages,
            dismissMessages: dismissMessages,
            getSentSummary: getSentSummary,
            getMessageStatus: getMessageStatus
        };

        ///////////

        function sendEmail(messageId) {
            var dto = {
                Ids: []
            };
            dto.Ids.push(messageId);
            return server.post('/api/comms/messages/sendemail', dto);
        }

        function deleteMessage(messageId) {
            var dto = {
                Ids: []
            };
            dto.Ids.push(messageId);
            return server.post('/api/comms/messages/remove', dto);
        }

        function deleteMessages(messageIds) {
            var dto = {
                Ids: messageIds
            };
            return server.post('/api/comms/messages/remove', dto);
        }

        function dismissMessages(messageIds) {
            var dto = {
                Ids: messageIds
            };
            return server.post('/api/comms/messages/dismiss', dto);
        }

        function getSentSummary(type) {
            return server.getQuietly('/api/comms/messages/sent-summary?MessageType=' + type);
        }

        function getMessageStatus(id) {
            return server.getQuietly('/api/comms/messages/status/' + id);
        }
    }
}());