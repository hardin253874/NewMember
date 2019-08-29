(function(){
    'use strict';

    angular.module('app')
        .service('subscriptionUtility', ['$q','$window','server','config','modalDetail', 'libraryLoader', 'permissionService', subscriptionUtility]);

    function subscriptionUtility($q, $window, server, config, modalDetail, libraryLoader, permissionService) {
        var subscriptionUrl = '/api/billing/subscription';

        return {
            loadData: loadDto,
            // subs
            newSubscriptionSave : newSubscriptionSave,
            removeSubscription : removeSubscription,
            modifyCreditCardSave : modifyCreditCardSave,
            // sms
            smsSpend: loadSmsSpend,
            purchaseSmsCredits : purchaseSmsCredits,
            smsSubscriptionSave : smsSubscriptionSave,
            bulkEnableSmsCommunication : bulkEnableSmsCommunication,
            // misc
            isSubscriberPermission : isSubscriberPermission,
            modalSubsPopup : modalPopup,
            clearSessionReload : clearSessionReload
        };


        /// function

        function loadDto() {
            // init
            var defer = $q.defer();

            libraryLoader.Stripe.load().then(function() {
                server.getQuietly(subscriptionUrl).success(function (data) {
                    Stripe.setPublishableKey(data.GatewayPublicKey);
                    defer.resolve(data);
                });
            });
            return defer.promise;
        }

        // subs
        function newSubscriptionSave(newPlanId) {
            if (!newPlanId) { return; }

            return server.post(subscriptionUrl, {GatewayPlanId: newPlanId});
        }

        function removeSubscription() {
            return server.delete(subscriptionUrl);
        }

        function modifyCreditCardSave(ccDetails) {
            
            var defer = $q.defer(),
                checkStripe = libraryLoader.Stripe.isLoaded;
            if (checkStripe) {
                Stripe.card.createToken(ccDetails, function (status, response) {
                    if (response.error) {
                        defer.reject(response.error.message);
                    } else {
                        server.post('/api/billing/subscription/modifyCard', {
                            NewCardToken: response.id
                        }).success(function(data){
                            defer.resolve(data);
                        });
                    }
                });
            } else {
                defer.reject('Error: could not locate Stripe.');
            }
            return defer.promise;
        }

        // sms
        function loadSmsSpend() {
            return server.getQuietly('/api/sms/spend');
        }

        function purchaseSmsCredits() {
            return server.post('/api/sms/credit/buy', null);
        }

        function smsSubscriptionSave(smsPlanDto) {
            if (angular.equals(smsPlanDto, {})) { return; }

            return server.post('/api/billing/sms/subscription', smsPlanDto);
        }

        function bulkEnableSmsCommunication() {
            return server.post('/api/billing/sms/BulkEnableSmsCommunication');
        }

        function isSubscriberPermission() {
            return permissionService.isSubscriber;
        }

        function modalPopup(templateUrl, data, options) {
            if(!templateUrl && !data) { return; }

            var modal = new modalDetail(templateUrl)
                .scope(data);

            if (modal) {
                modal.show(options);
            }
            return modal;
        }

        function clearSessionReload(){

            // clear session to force session reload
            config.session = null;

            // refresh the page
            $window.location.reload(true);
        }
    }

})();