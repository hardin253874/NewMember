(function () {
    'use strict';

    angular.module('app').service('addressParser', [service]);

    function service() {
        var self = this;

        this.blankAddress = function () {
            this.Latitude = '';
            this.Longitude = '';
            this.BuildingName = '';
            this.Unit = '';
            this.Number = '';
            this.Street = '';
            this.Suburb = '';
            this.PostalCode = '';
            this.State = '';
            this.Country = '';
            this.Text = self.combine(this);
            this.modeType = { google: 0, manual: 1};
            this.mode = this.modeType.manual;
            this.IsInit = undefined;
        };

        this.validateAddress = function (address) {
            var mandatory = ['number', 'street', 'suburb', 'postalcode', 'state'];
            var valid = 0;

            for (var p in address) {
                if (valid === mandatory.length) {
                    break;
                }
                if (mandatory.indexOf(p.toLowerCase()) > -1 && address[p]) {
                    valid++;
                }
            }

            return valid === mandatory.length;
        };

        this.parseGoogleAddress = function (place) {
            var address = new self.blankAddress();

            address.Latitude = place.geometry.location.lat();
            address.Longitude = place.geometry.location.lng();
            address.BuildingName = getPart('establishment');
            address.Unit = getPart('subpremise');
            address.Number = getPart('street_number');
            address.Street = getPart('route');
            address.Suburb = getPart('locality');
            address.PostalCode = getPart('postal_code');
            address.State = getPart('administrative_area_level_1');
            address.Country = getPart('country', true);
            address.mode = address.modeType.google;
            address.IsInit = false;

            return address;

            function getPart(addressType, longName) {
                if (!place) {
                    return '';
                }
                for (var i = 0; i < place.address_components.length; i++) {
                    var part = place.address_components[i];
                    for (var j = 0; j < part.types.length; j++) {
                        var type = part.types[j];
                        if (type === addressType) {
                            if (longName) {
                                return part.long_name;
                            } else {
                                return part.short_name;
                            }
                        }
                    }
                }
                return '';
            }
        };

        this.combine = function (address) {
            var a = address,
                text = '';
            text +=
                (a.BuildingName ? a.BuildingName + ' ' : '') +
                (a.Unit ? a.Unit + '/' : '') +
                (a.Number ? a.Number + ' ' : '') +
                (a.MailboxName ? a.MailboxName + ' ' : '') +
                (a.Street ? a.Street + ', ' : '') +
                (a.Suburb ? a.Suburb + ', ' : '') +
                (a.State ? a.State + ' ' : '' ) +
                (a.PostalCode ? a.PostalCode + ' ' : '' ) +
                (a.Country ? a.Country : '' );
            return text;
        };

        this.split = function (text) {
            var result = self.process(text);
            if (!result) {
                result = {};
            }

            var address = new self.blankAddress();
            address.Unit = fixNull(result.unit);
            address.Number = fixNull(result.number);
            address.Street = (fixNull(result.street) + ' ' + fixNull(result.roadtype)).toTitleCase();
            address.Suburb = (fixNull(result.suburb)).toTitleCase();
            address.PostalCode = fixNull(result.postal);
            address.State = fixNull(result.state).toUpperCase();
            address.Country = (fixNull(result.country)).toTitleCase();
            address.IsInit = false;
            return address;

            function fixNull(value) {
                if (value === null || value === undefined) {
                    return '';
                }
                return value;
            }
        };

        this.process = function (text) {
            var result = {};
            var patterns = self.compilePatterns();
            if (!text) {
                return null;
            }
            text += ''; //add an empty string to force it to be a string
            text = text.replace(/[,\n]/g, '');
            text = text.replace(/<BR>/g, '');
            for (var i = 0; i < patterns.length; i++) {
                var rx = new RegExp(patterns[i].pattern, 'i');
                var test = rx.test(text);
                if (!test) {
                    continue;
                }
                var match = rx.exec(text);
                if (match && match.length - 1 === patterns[i].extract.length) {
                    for (var k = 1; k < patterns[i].extract.length + 1; k++) {
                        result[patterns[i].extract[k - 1]] = match[k];
                    }
                    return result;
                }
            }
            return null;
        };

        this.patterns = [];

        this.compilePatterns = function () {
            if (self.patterns.length > 0) {
                return self.patterns;
            }

            var roadType = '(road|rd|street|st|drive|dr|lane|ln|place|pl|parade|pde|cresent|cres|cr|close|highway|hwy|hway|way|avenue|ave|boulevard|blvd|circle|cir|square)';
            var number = '(\\w?\\d{1,6}-?\\d{0,6}\\w?)';
            var unitnumber = number + '/' + number;
            var state = '([A-Z]{2,3})';
            var postal = '(\\d{4,8})';
            var mailbox_name = '(p\\.? ?o\\.? box \\d{1,6}|locked bag \\d{1,6})';
            var patterns = [
                { pattern: 'MAILBOX_NAME (.*) STATE POSTAL',
                    extract: ['MailboxName',
                        'suburb',
                        'state',
                        'postal']
                },
                { pattern: 'MAILBOX_NAME (.*) POSTAL',
                    extract: ['MailboxName',
                        'suburb',
                        'postal']
                },
                { pattern: 'UNITNUMBER (.*) ROADTYPE (.*) STATE POSTAL',
                    extract: ['unit',
                        'number',
                        'street',
                        'roadtype',
                        'suburb',
                        'state',
                        'postal']
                },
                { pattern: 'NUMBER (.*) ROADTYPE (.*) STATE POSTAL',
                    extract: ['number',
                        'street',
                        'roadtype',
                        'suburb',
                        'state',
                        'postal']
                },
                { pattern: 'NUMBER (.*) ROADTYPE (.*) POSTAL',
                    extract: ['number',
                        'street',
                        'roadtype',
                        'suburb',
                        'postal']
                },
                { pattern: 'UNITNUMBER (.*) ROADTYPE (.*) STATE POSTAL (.*)',
                    extract: ['unit',
                        'number',
                        'street',
                        'roadtype',
                        'suburb',
                        'state',
                        'postal',
                        'country']
                },
                { pattern: 'NUMBER (.*) ROADTYPE (.*) STATE POSTAL (.*)',
                    extract: ['number',
                        'street',
                        'roadtype',
                        'suburb',
                        'state',
                        'postal',
                        'country']
                },
                { pattern: 'UNITNUMBER (.*) ROADTYPE (.*) STATE',
                    extract: ['unit',
                        'number',
                        'street',
                        'roadtype',
                        'suburb',
                        'state']
                },
                { pattern: 'NUMBER (.*) ROADTYPE (.*) STATE',
                    extract: ['number',
                        'street',
                        'roadtype',
                        'suburb',
                        'state']
                },
                { pattern: 'UNITNUMBER (.*) ROADTYPE (.*)',
                    extract: ['unit',
                        'number',
                        'street',
                        'roadtype',
                        'suburb']
                },
                { pattern: 'NUMBER (.*) ROADTYPE (.*)',
                    extract: ['number',
                        'street',
                        'roadtype',
                        'suburb']
                },
                { pattern: 'UNITNUMBER (.*) ROADTYPE',
                    extract: ['unit',
                        'number',
                        'street',
                        'roadtype']
                },
                { pattern: 'NUMBER (.*) ROADTYPE',
                    extract: ['number',
                        'street',
                        'roadtype']
                },
                { pattern: 'MAILBOX_NAME (.*)',
                    extract: ['MailboxName',
                        'suburb']
                },
                { pattern: 'MAILBOX_NAME',
                    extract: ['MailboxName']
                },
                { pattern: '(.*) ROADTYPE (.*)',
                    extract: ['street',
                        'roadtype',
                        'suburb']
                },
                { pattern: 'NUMBER (.*) ',
                    extract: ['number',
                        'street']
                },
                { pattern: 'MAILBOX_NAME',
                    extract: ['MailboxName']
                },
                { pattern: '(.*)',
                    extract: ['street']
                }
            ];
            for (var i = 0; i < patterns.length; i++) {
                var compiled = patterns[i].pattern;
                compiled = compiled.replace('UNITNUMBER', unitnumber);
                compiled = compiled.replace('ROADTYPE', roadType);
                compiled = compiled.replace('NUMBER', number);
                compiled = compiled.replace('STATE', state);
                compiled = compiled.replace('POSTAL', postal);
                compiled = compiled.replace('MAILBOX_NAME', mailbox_name);
                patterns[i].pattern = compiled;
            }

            return patterns;
        };
    }
})();