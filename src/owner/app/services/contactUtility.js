(function () {
    'use strict';
    angular.module('app').service('contactUtility', ['$timeout', 'textFormat', 'session', contactUtility ]);

    function contactUtility ($timeout, textFormat, session) {
        return {
            validatePerson: validatePerson,
            validatePeople: validatePeople,
            validateBankAccount: validateBankAccount,
            validateBankAccounts: validateBankAccounts,
            removeDeleted: removeDeleted,
            getPersonName:getPersonName,
            addAccountDetail:addAccountDetail,
            removeSelectedAccount:removeSelectedAccount,
            watchAccountDetail:fixRemaining
        };

        // FUNCTIONS //

        function validatePerson(person) {
            var isValid = true;
            var name = getPersonName(person);

            if (person.isDeleted) {
                isValid = true;
            } else if (name.length < 1){
                //person.alert = { type: 'danger', message: 'A person require either a first name, last name or company name.' };
                //isValid = false;
            } else if (_.contains(person.CommunicationPreferences, 'ByEmail') && person.Email.length < 4) {
                person.alert = { type: 'warning', message: 'You have chosen to send email communications to the person ' + name +
                                                           ', but you have not entered a valid email address for them.' };

                isValid = false;
            } else if (_.contains(person.CommunicationPreferences, 'BySms') && _.isEmpty(person.CellPhone)) {
                person.alert = { type: 'warning', message: 'You have chosen to send SMS communications to the person ' + name +
                ', but you have not entered a valid mobile phone number for them.' };
                isValid = false;
            }
            else {
                person.alert = null;
            }
            return isValid;
        }

        /// result:  first last - company
        function getPersonName(person){
            var result = '';

            if(!angular.isUndefined(person) && person !== null){
                if (person.FirstName && person.FirstName.trim() !== '') {
                    result += person.FirstName.trim() + ' ';
                }
                if (person.LastName && person.LastName.trim() !== '') {
                    result += person.LastName.trim();
                }

                if (person.CompanyName && person.CompanyName.trim() !== '') {
                    if (result.length > 0) {
                        result += ' - ';
                    }
                    result += person.CompanyName.trim();
                }
            }

            return result.trim();
        }

       function validateBankAccount(account){
            var isValid = true;
            var rxBSB = /[0-9][0-9][0-9][0-9][0-9][0-9]/;
            var rxBSBdash = /[0-9][0-9][0-9]-[0-9][0-9][0-9]/;

           if (account.PaymentMethod === 'EFT') {

               if (!account.Payee) {
                   account.alert = { type: 'warning', message: 'Please enter a Payee for EFT payment.'};
                   isValid = false;
               } else if (session.hasBsb() && (!account.BSB || (!rxBSB.test(account.BSB) && !rxBSBdash.test(account.BSB)))) {
                   account.alert = { type: 'warning', message: 'Please enter a 6-digit BSB.' };
                   isValid = false;
               } else if (rxBSBdash.test(account.BSB)) {
                   //remove the dash from it it
                   //account.BSB = account.BSB.substr(0, 3) + '-' + account.BSB.substr(3, 3);
                   account.BSB = account.BSB.replace('-','');
               } else if (!account.AccountNumber) {
                   account.alert = { type: 'warning', message: 'Please enter an Account number.'};
                   isValid = false;
               } else {
                   account.alert = null;
               }

            }
           //Todo: Whole BPay implement
//           if (account.PaymentMethod === 'BPay') {
//
//               if (!account.BillerCode) {
//                   account.alert = { type: 'warning', message: 'Please enter an Biller code.' };
//                   isValid = false;
//               } else if (!account.BillerReference) {
//                   account.alert = { type: 'warning', message: 'Please enter an Biller reference.'};
//                   isValid = false;
//               } else {
//                   account.alert = null;
//               }
//
//           }
            if (account.PaymentMethod === 'Cheque') {
                if (!account.Payee) {
                    account.alert = { type: 'warning', message: 'Please enter a Payee for ' + session.Region.ChequeLabel + ' payment.'};
                    isValid = false;
                } else {
                    account.alert = null;
                }
            }
            return isValid;
        }

        //validates EVERYTHING - does not stop on first failure
        function validatePeople(people) {
            var isValid = true;
            for (var i = people.length - 1; i >= 0; i--) {
                if (!validatePerson(people[i])) {
                    isValid = false;
                }
            }
            return isValid;
        }

        //validates EVERYTHING - does not stop on first failure
        function validateBankAccounts(accountList) {
            var isValid = true;
            for (var i = accountList.length - 1; i >= 0; i--) {
                if (!validateBankAccount(accountList[i])) {
                    isValid = false;
                }
            }
            return isValid;
        }

        function removeDeleted(contact) {
            contact.ContactPersons = contact.ContactPersons.filter(function (contact) {
               return !contact.isDeleted;
            });
        }

        // -- Account Details --

        function addAccountDetail(vm, accounts) {
            var newAcc = {
                AccountNumber: '',
                BSB: '',
                BillerCode: '',
                BillerReference: '',
                Payee: 'New payee',
                PaymentMethod: 'EFT',
                Percentage: remainingPercent(accounts),
                Value: 0
            };
            accounts.push(newAcc);
            vm.selectedAccount = newAcc;

            fixRemaining(accounts);
        }

        function remainingPercent(accounts) {
            var remaining = 100;
            accounts.forEach(function(acc) {
                remaining -= acc.Percentage;
            });
            return remaining;
        }

        function fixRemaining(accounts) {
            $timeout(function () {
                // only fix the last one
                var percent = 0;
                var i = 1;
                accounts.forEach(function (acc) {
                    if (i === accounts.length) {
                        acc.Percentage = 100 - percent;
                    } else {
                        percent += acc.Percentage;
                    }
                    i++;
                }
                );
            });
        }

        function removeSelectedAccount(vm, accounts, index) {
            accounts.splice(index,1);
            vm.selectedAccount = accounts[0];
            fixRemaining(accounts);
        }

    }
})();
