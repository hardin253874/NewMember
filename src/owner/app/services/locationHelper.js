(function () {
	'use strict';
	angular.module('app').service('locationHelper',
        ['$rootScope', '$location', '$routeParams', '$uibModal', service]);

    function service ($rootScope, $location, $routeParams, $uibModal) {

        return {
            closeModal: closeModal,
            routeBack: routeBack,
            go: go,
            folio: folio,
            lot: lot,
            contact: contact,
            inspection: inspection,
            tenant: tenant,
            task: task,
            job: job,
            messagePreview :messagePreview,
            newEmail :newEmail,
            messageThread: messageThread,
            newSms: newSms,
            newLetter: newLetter,
            newTask: newTask,
            newJob: newJob,
            newJobQuote: newJobQuote,
            newInspection: newInspection,
            dashboard: dashboard,
            transaction: transaction,
            bill: bill,
            subscribe: subscribe
        };

        function routeBack() {
            // Simple convention based on $routeParams of where to return to
            if ($routeParams.lotId) {
                lot($routeParams.lotId);
            } else if ($routeParams.contactId) {
                contact($routeParams.contactId);
            } else if ($routeParams.folioId) {
                 folio($routeParams.folioId);
            } else if ($routeParams.inspectionId) {
               inspection($routeParams.inspectionId);
            } else if ($routeParams.taskId) {
                task($routeParams.taskId);
            } else if ($routeParams.jobId) {
                job($routeParams.jobId);
            } else {
                return false;
            }
            return true;
        }

        function go(path) {
            $location.url(path);
        }

        function dashboard() {
            go('/dashboard/now');
        }

        function folio(folioId) {
            if (folioId) {
                go('/folio/transactions/' + folioId);
            } else {
                go('/dashboard/now');
            }
        }

        function lot(lotId) {
            if (lotId) {
                go('/property/card/' + lotId);
            } else {
                go('/property');
            }
        }

        function contact(contactId) {
            if (contactId) {
                go('/contact/card/' + contactId);
            } else {
                go('/contact');
            }
        }

        function inspection(inspectionId) {
            if (inspectionId) {
                go('/inspection/card/' + inspectionId);
            } else {
                go('/inspection');
            }
        }

        function tenant(folioId) {
            if (folioId) {
                go('/folio/tenant/' + folioId);
            } else {
                go('/dashboard/now');
            }
        }

        function task(taskId) {
            if (taskId) {
                go('/task/card/' + taskId);
            } else {
                go('/task');
            }
        }

        function job(jobId) {
            if (jobId) {
                go('/jobtask/card/' + jobId);
            } else {
                go('/jobtask');
            }
        }

        function messageThread(messageThreadId) {
            if (messageThreadId) {
                go('/message/thread/' + messageThreadId);
            } else {
                go('/message/inbox');
            }
        }

        function transaction(journalId) {
            var options = {
                component: 'pmcTransactionCard',
                resolve: {
                    id: function () {
                        return journalId;
                    }
                },
                windowClass: "modal-view"
            };

            return openModal(options);
        }

        function bill(journalId) {
            if (journalId) {
                var options = {
                    component: 'pmcTransactionBillCard',
                    resolve: {
                        id: function () {
                            return journalId;
                        }
                    },
                    windowClass: "modal-view"
                };

                return openModal(options);
            } else {
                go('/bill');
            }
        }

        function messagePreview(messageId) {
            var options = {
                component: 'pmcMessagePreview',
                resolve: {
                    id: function () {
                        return messageId;
                    }
                },
                windowClass: "modal-preview message-preview"
            };

            return openModal(options);
        }

        function newEmail(messageId, contactId, replyToId, action) {
            var accessor = {
                opened: null,
                rendered: null
            };

            var options = {
                component: 'pmcMessageNewEmail',
                resolve: {
                    id: function () {
                        return messageId;
                    },
                    replyToId: function() {
                        return replyToId;
                    },
                    contactId: function() {
                        return contactId;
                    },
                    action: function () {
                        return action;
                    },
                    modal: function () {
                        return accessor;
                    }
                },
                windowClass: "modal-preview message-preview"
            };

            var modalResult = openModal(options);

            accessor.opened = modalResult.opened;
            accessor.rendered = modalResult.rendered;

            return modalResult;
        }

        function newSms(messageId, contactId) {
            var options = {
                component: 'pmcMessageNewSms',
                resolve: {
                    id: function () {
                        return messageId;
                    },
                    contactId: function() {
                        return contactId;
                    }
                },
                windowClass: ""
            };

            return openModal(options);
        }

        function newLetter(messageId, contactId) {
            var accessor = {
                opened: null,
                rendered: null
            };

            var options = {
                component: 'pmcMessageNewLetter',
                resolve: {
                    id: function () {
                        return messageId;
                    },
                    contactId: function() {
                        return contactId;
                    },
                    modal: function () {
                        return accessor;
                    }
                },
                windowClass: "modal-preview message-preview"
            };

            var modalResult = openModal(options);

            accessor.opened = modalResult.opened;
            accessor.rendered = modalResult.rendered;

            return modalResult;
        }

        function newTask(lotId, contactId) {
            var options = {
                component: 'pmcNewTask',
                resolve: {
                    lotId: function() {
                        return lotId;
                    },
                    contactId: function() {
                        return contactId;
                    }
                },
                windowClass: "modal-task"
            };

            return openModal(options);
        }

        function newJob(lotId, contactId) {
            var options = {
                component: 'pmcNewJob',
                resolve: {
                    lotId: function() {
                        return lotId;
                    },
                    contactId: function() {
                        return contactId;
                    }
                },
                windowClass: "modal-task"
            };

            return openModal(options);
        }

        function newJobQuote(jobTaskQuoteId, jobTaskId) {
            var options = {
                component: 'pmcNewJobQuote',
                resolve: {
                    jobTaskQuoteId: function() {
                        return jobTaskQuoteId;
                    },
                    jobTaskId: function() {
                        return jobTaskId;
                    }
                },
                windowClass: "modal-task"
            };

            return openModal(options);
        }

        function subscribe() {
            go('/subscriber/edit');
        }

        function newInspection(lotId, contactId) {
            var options = {
                component: 'pmcNewInspection',
                resolve: {
                    lotId: function() {
                        return lotId;
                    },
                    contactId: function() {
                        return contactId;
                    }
                },
                windowClass: "modal-task"
            };

            return openModal(options);
        }

        function openModal(options) {
            closeModal();

            var modalResult = $uibModal.open(options);

            $rootScope.modalResult = modalResult;

            modalResult.result.then(function (response) {
                if (response && response.callbackFn) {
                    response.callbackFn();
                }
                $rootScope.modalResult = null;
            });

            return modalResult;
        }

        function closeModal() {
            if ($rootScope.modalResult) {
                $rootScope.modalResult.dismiss();
                $rootScope.modalResult = null;
            }
        }
    }
}());