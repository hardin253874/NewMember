(function () {
    'use strict';

    angular.module('app').service('timeAdaptor', [service]);

    function service() {
        this.outputFormat = 'h:mm A'; //TODO - modify the output format based on locale
        this.getInt = function(datetime) {
            if (!datetime) {
                return 0;
            }
            return moment(datetime).utc().format('HHmm');
        };

        this.getTime = function(int) {
            var d = getTimeMoment(int);
            return d.format(this.outputFormat);
        };

        this.getMoment = getTimeMoment;

        this.addMinutes = function(int, minutes) {
            int = Number(int);
            var mOrig = getTimeMoment(int);
            var mNew = mOrig.add(minutes,  'minutes');
            var latestPossible = getTimeMoment(2359);
            var earliestPossible = getTimeMoment(1);

            if (mNew.isBefore(latestPossible) && mNew.isAfter(earliestPossible)) {
                return mNew.format('HHmm');
            } else if (mNew.isBefore(latestPossible)){
                //therefore is not after the earliest
                return 1;
            } else {
                return 2359;
            }

        };

        this.differenceInMinutes = function (laterTimeInt, earlierTimeInt) {
            return getTimeMoment(laterTimeInt).diff(getTimeMoment(earlierTimeInt),  'minutes');

           // return Math.floor(getTimeMoment(laterTimeInt).add('seconds',30).diff(getTimeMoment(earlierTimeInt),  'minutes'));
            //we add 30 seconds extra and then take the floor value, to avoid odd situations where moment return 930 - 900 = 29;
        };

        this.parseInput = function (str) {
            //returns an int

            //we have better control parsing this ourselves rather than using moment
            var p24 = /^(1[0-9]|2[0-3]|0?[0-9])*(:|.)?([0-5][0-9])$/,                   // 130, 1359, 22:50, 18.01 etc
                p12 = /^(10|11|12|0?[0-9])*(:|.)?([0-5][0-9])(\s)*(a|A|p|P)(m|M)?$/,//123p (-> 1.23pm) , 3:54 AM, etc
                p12OnlyHour = /^(10|11|12|0?[1-9])(\s)*(a|A|p|P)(m|M)?$/;              // 10am, 9 a, 2pm etc

            var hours, minutes, chunks, ampm;

            if (p12OnlyHour.test(str)) {
                //test short hand first
                chunks = p12OnlyHour.exec(str);
                hours = Number(chunks[1]);
                minutes = 0;
                ampm = chunks[3];

                if (hours < 12 && (ampm === 'p' || ampm === 'P' )) {
                    hours = hours + 12;
                } else if (hours == 12 && (ampm === 'a' || ampm === 'A' )) {
                    hours = 0;
                }

            } else if (p12.test(str)) {
                chunks = p12.exec(str);
                hours = Number(chunks[1]);
                minutes = Number(chunks[3]);
                ampm = chunks[5];

                if (hours < 12 && (ampm === 'p' || ampm === 'P' )) {
                    hours = hours + 12;
                } else if (hours == 12 && (ampm === 'a' || ampm === 'A' )) {
                    hours = 0;
                }
            } else if (p24.test(str)) {
                chunks = p24.exec(str);
                hours = Number(chunks[1]);
                minutes = Number(chunks[3]);
            } else  {
                return undefined;
            }

            return hours * 100 + minutes;

        };

        function getTimeMoment (int) {
            if (angular.isUndefined(int)) {
                console.log('Cannot getTimeMoment of undefined',int);
                return '';
            }
            var i = Number(int),
                h = Math.floor(i / 100),
                m = Math.ceil(i - (h * 100));

            //always sets it to be TODAY and at UTC
            return  moment.utc().hour(h).minute(m)
                        .seconds(0).milliseconds(0) //need to set the minor values all to zero
                        ;
        }


    }
})();