(function () {
	'use strict';
	angular.module('app').service('agencyFeeTemplates', ['server', 'textFormat', agencyFeeTemplates]);
    function agencyFeeTemplates (server, textFormat) {
        var apiPath = '/api/financial/agencyFeeTemplates/';
        
        var arrFeeTriggerTypesDiction = [
                {
                    Id: 'RentReceipt' ,
                    Description: 'Every rent receipt'
                },
                {
                    Id: 'FirstRentReceipt',
                    Description: 'First rent receipt'
                },
                {
                    Id: 'FirstReceiptPerStatement',
                    Description: 'Each statement period'
                },
                {
                    Id: 'TimeBased',
                    Description: 'Recurring'
                },
                {
                    Id: 'InspectionOnEntry',
                    Description: 'Inspection - completed entry'
                },
                {
                    Id: 'InspectionOnExit',
                    Description: 'Inspection - completed exit'
                },
                {
                    Id: 'InspectionOnRoutine',
                    Description: 'Inspection - completed routine'
                }
            ];
            
        return {
            all: all,
            getTypeText: getTypeText,
            getChargeTypeText: getChargeTypeText,
            getFrequencyDayText: getFrequencyDayText,
            getFrequencyDayOfWeekText: getFrequencyDayOfWeekText,
            getFrequencyMonthText: getFrequencyMonthText
        };

        function all() {
          return server.getQuietly(apiPath + '?IsActive=true');
        }
        
        function getTypeText(type) {
          var text = _.findWhere(arrFeeTriggerTypesDiction, { Id: type });
          if (text) {
            return text.Description;
          }
          
          return '';
        }
        
        function getChargeTypeText(chargeType) {
            if (chargeType === 'Folio') {
                return 'Owner';
            }
          
            if (chargeType === 'Ownership') {
                return 'Property'; 
            }
          
            return '';
        }

        function getFrequencyDayText(frequencyDay) {
            return textFormat.dayOfMonthText(frequencyDay);
        }

        function getFrequencyDayOfWeekText(frequencyDayOfWeek) {
            return textFormat.dayOfWeekByNumber(frequencyDayOfWeek);
        }

        function getFrequencyMonthText(frequencyMonth) {
            return textFormat.monthByNumber(frequencyMonth);
        }
    }
}());