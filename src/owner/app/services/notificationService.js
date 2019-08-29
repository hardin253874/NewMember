(function () {
    'use strict';
    angular.module('app').service('notificationService', ['$rootScope', '$timeout', 'server', 'config', 'ux', eventService]);

    function eventService ($rootScope, $timeout, server, config, ux) {
        var svc = this;

        svc.disabled = false;
        svc.newAlerts = [];
        svc.hasNewEvent = false;
        svc.setRead = setRead;
        svc.newAlertCount = 0;
        svc.loadUnreadAlerts = loadUnreadAlerts;
        svc.waitingToLoadingAlerts = true;

        var timestamp = null;
        var _statusConnected = true;

        init();

        return svc;

        /////////////////////

        function init() {

            if (config.session && config.session.AgentAccess) {
                var customerId = config.session.AgentAccess.CustomerId;
                var source;

                if (window.EventSource) { //stop IE from throwing an error because this doesn't exist
                    source =   new EventSource('/api/stream/events?channel=' + customerId + '&t=' + new Date().getTime());
                } else {
                    svc.disabled = true;
                }

                if (source) {
                    svc.disabled = false;

                    $(source).handleServerEvents({
                        handlers: {
                            EventLog: function (event) {
                                //events.unshift(event);
                                countNewItem(event);
                                broadcastItem(event);
                            },
                            SystemAlert: function (systemAlert) {
                                $rootScope.$broadcast(config.events.refreshSystemAlerts, systemAlert);
                            },
                            ProcessTransactionEvent: function(processEvent) {
                                $rootScope.$broadcast('processtransactionevent:completed', processEvent);
                            },
                            NotifyFailure: function(n) {
                                ux.alert.error(n.Message);
                            },
                            NotifySuccess: function(n) {
                                ux.alert.success(n.Message);
                            },
                            NotifyWarning: function(n) {
                                ux.alert.warning(n.Message);
                            },
                            SignOut: function(msg) {
                                $rootScope.$broadcast(config.events.userSignedOut, msg);
                            }
                        }
                    });

                    var _delayed = null;
                    source.onerror = function(e) {
                        if (_.isNull(_delayed))
                        {
                            _delayed = setTimeout(function() {
                                serverDisconnected();
                            }, 7000);
                        }
                    };

                    source.onopen = function(e) {
                        if (!_.isNull(_delayed))
                        {
                            clearTimeout(_delayed);
                            _delayed = null;
                            serverReconnected();
                        }
                    };
                }
            }

            // Try to prevent owner portal permission error
            if(!config.session) {
                $timeout(init,500);
                return;
            }
        }

        function loadUnreadAlerts() {
            // only load it once, it's very expensive
            if(svc.waitingToLoadingAlerts) {
                return server
                    .get('/api/entity/eventlog/alerts/unread?Level=1')
                    .success(function (events) {
                            events.forEach(function (event) {
                                event.links = getAlertLinkUrls(event);
                            });

                            svc.newAlerts = events;
                            svc.newAlertCount = svc.newAlerts.length;

                            svc.waitingToLoadingAlerts = false;

                            $timeout(function () {
                                $rootScope.$apply();
                            });
                        }
                    );
            }
        }

        function setRead() {
            if (svc.newAlerts.length > 0) {
                timestamp = svc.newAlerts[0].TimestampText;
            }

            if (timestamp && (svc.newAlerts.length > 0) ) {
                server.post('/api/entity/notifications/read', { Timestamp: timestamp }).success(function (result) {

                        $timeout(function () {
                            svc.newAlerts.forEach(function (event) {
                                event.IsRead = true;

                            });
                            svc.newAlertCount =0;
                        }, 1000);
                    }
                );
            }
        }

        function countNewItem(event) {

            if (!event.IsRead && event.Importance > 0) {
                if (event.Type === 'Alert') {
                    event.links = getAlertLinkUrls(event);
                    svc.newAlerts.push(event);
                    svc.newAlertCount ++;
                    $timeout(function () { $rootScope.$apply(); });
                }
            }
        }

        function serverDisconnected() {
            console.log("Server connection status [serverDisconnected]: ", _statusConnected);
            _statusConnected = false;
            $rootScope.$broadcast(config.events.serverDisconnected);
        }

        function serverReconnected() {
            console.log("Server connection status [serverReconnected]: ", _statusConnected);
            if (!_statusConnected) {
                _statusConnected = true;
                $rootScope.$broadcast(config.events.serverReconnected);
            }
        }

        function broadcastItem(event) {
            svc.hasNewEvent = true;

            if (!event) {
                return;
            }

            // Broadcast and event for the Entity and for the Action.
            // Some areas of the app care most about specific entities, others specific actions

            var affectedName = 'affected:' + event.LinkType.toLowerCase();
            $rootScope.$broadcast(affectedName, event);

            if(event.Action) {
                var actionName = 'action:' + event.Action.toLowerCase();
                $rootScope.$broadcast(actionName, event);
            }
        }

        function getAlertLinkUrls(ev) {
            var arr = [];
            if (ev.ContactReference && ev.ContactId) {
                arr.push({text: ev.ContactReference, href: '#/contact/card/' + ev.ContactId});
            }
            if (ev.LotReference && ev.LotId) {
                arr.push({text: ev.LotReference, href: '#/property/card/' + ev.LotId});
            }

            // link to stripe invoice report
            if (ev.LinkType === 'StripeInvoice' && ev.LinkReference) {
                arr.push({
                    text: 'PropertyMe Invoice',
                    href: '/app/open/report.html?r=/api/reports/invoices/billing?BillingInvoiceId%3D' + ev.LinkReference,
                    target: '_blank'
                });
            }
            return arr;
        }
    }
}());
