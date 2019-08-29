(function () {
    'use strict';
    angular.module('app').service('activityService', ['textFormat', 'iconMapper', 'config', '$sanitize', activityService]);
    function activityService(textFormat, iconMapper, config, $sanitize) {
        return {
            renderDateCanBeMuted: renderDateCanBeMuted,
            renderLinks: renderLinks,
            renderIconColumn: renderIconColumn,
            renderColumnLink: renderColumnLink,
            renderTextCanBeMuted: renderTextCanBeMuted,
            renderLogDetail: renderLogDetail,
            renderJobSummary: renderJobSummary,
            renderTaskSummary: renderTaskSummary,
            renderInspectionSummary: renderInspectionSummary,
            renderMessageSubject: renderMessageSubject
        };

        function renderDateCanBeMuted(value, action, obj) {
            if (action === 'display') {
                var output = textFormat.date(value);
                if ((!_.isEmpty(obj.CompletedOn) || !_.isEmpty(obj.ClosedOn)) && value !== null) {
                    output = '<span class="text-muted">' + output + '</span>';
                }
                return output;
            } else {
                return value;
            }
        }

        function renderLinks(value, action, obj) {
            var reg = renderColumnRegarding(value, action, obj), f = renderColumnFor(value, action, obj);
            return (reg ? reg + ' ' : '') + f;
        }

        function renderColumnRegarding(value, action, obj) {
            if (obj.RegardingType === null) {
                return '';
            }
            var label = (obj.RegardingType).fromEnumToSentence();
            var detail = obj.MoreDetail;
            var ic;

            var hideThese = ['Member', 'Inspection'];
            if (hideThese.contains(label)) {
                label = '';
            }
            if (label === 'Message') {

                if (detail.contains('email')) ic = iconMapper.map('email');
                if (detail.contains('SMS')) ic = iconMapper.map('sms');
                if (detail.contains('print')) ic = iconMapper.map('print');
                if (ic) {
                    label = ' <i class="' + ic + ' "></i> ' + label;
                }


            }

            if (config.PATH_MAP[obj.RegardingType]) {
                return '<a class="" href="' + config.PATH_MAP[obj.RegardingType] + obj.RegardingId + '">' + label + '</a>';
            } else {
                return ''; //only show labels with links
            }
        }

        function renderColumnFor(value, action, obj) {
            var label = obj.LinkReference || (obj.LinkType).fromEnumToSentence();
            var ic = iconMapper.map(obj.LinkType);
            if (ic) {
                label = '<i class="' + ic + ' "></i> ' + label;
            }

            if (config.PATH_MAP[obj.LinkType]) {
                // if (!_.isEmpty(obj.CompletedOn)) {
                //     label = '<span class="text-muted">' + label + '</span>';
                // }
                return '<a class="" href="' + config.PATH_MAP[obj.LinkType] + obj.LinkId + '">' + label + '</a>';
            } else if (label !== 'Unspecified') {
                return ''; //only show labels with links
            } else {
                return '';
            }
        }

        function renderColumnLink(value, action, obj) {
            var label = value || obj.LinkType;
            label = $sanitize(label);
            if (!_.isEmpty(obj.CompletedOn) || !_.isEmpty(obj.ClosedOn)) {
                label = '<div class="grid-td-inner" title="' + label + '">' + label + '</div>';
            }

            if (config.PATH_MAP[obj.LinkType]) {
                var path = config.PATH_MAP[obj.LinkType] + obj.LinkId;
                return '<a class="" href="' + path + '">' + label + '</a>';
            } else if (obj.LinkType === 'Document') {
                return '<a class="" href="api/comms/message/' + obj.LinkId + '/document" target="_blank">' + label + '</a>';
            } else if (obj.LinkType === 'MemberComment') {
                return label;
            } else if (obj.LinkType === 'Message') {
                return '<a class="open" href="">' + (obj.Subject || obj.MessageScheduleName) + '</a>'
            } else if (label !== 'Unspecified') {
                return ''; //only show labels with links
            } else {
                return '';
            }
        }

        function renderIconColumn(value, action, obj) {
            var label = value.fromEnumToSentence();
            if (value === 'MemberComment') {
                label = 'Comment';
            }
            var ic = iconMapper.map(value);
            if (ic) {
                label = '<i class="' + ic + ' "></i> ' + label;
            }
            if (!_.isEmpty(obj.CompletedOn)) {
                label = '<span class="text-muted">' + label + '</span>';
            }
            return label;
        }

        function renderTextCanBeMuted(value, action, obj) {
            if (action === 'display') {
                if (!_.isEmpty(obj.CompletedOn) || !_.isEmpty(obj.ClosedOn)) {
                    value = '<span class="text-muted">' + value + '</span>';
                }
                return value;
            } else {
                return value;
            }
        }

        function renderLogDetail(value, action, obj) {
            // var sf = renderColumnFor(value, action, obj);
            // var sr = renderColumnRegarding(value, action, obj);
            var reg = obj.RegardingType,
                detail = obj.MoreDetail,
                link = value;

            if (obj.Type === 'Comment') {
                detail = '<em>' + textFormat.escapeHtml(detail) + '</em>';
            }

            return icons() + detail;//+ ' ' + sr + ' ' + sf;

            function icons() {
                var arr = [], style = 'style="width:18px"';
                if (iconMapper.map(link)) add(iconMapper.map(link));
                if (iconMapper.map(obj.Type)) add(iconMapper.map(obj.Type));
                if (reg !== 'Message' && iconMapper.map(reg)) add(iconMapper.map(reg));
                if (detail.contains('email')) add(iconMapper.map('email'));
                if (detail.contains('SMS')) add(iconMapper.map('sms'));

                //make sure there is exactly 2 icons
                arr.first(2);
                while (arr.length < 2) {
                    arr.push('icon-blank');
                }

                if (arr.length) {
                    return '<i ' + style + ' class="' + arr.join(' icon-large muted disp-ib"></i> <i ' + style + ' class="') + ' icon-large muted  disp-ib"></i> ';
                } else {
                    return '';
                }
                function add(i) {
                    if (!arr.contains(i)) arr.push(i);
                }
            }
        }

        function renderJobSummary(value, action, obj) {
            // // extending obj type
            if (action === 'display' && !_.isEmpty(obj)) {
                obj.LinkType = 'Job';
                obj.LinkId = obj.Id;
                return renderColumnLink(value, action, obj);
            } else {
                // required to avoid error on sort :
                // https://datatables.net/manual/tech-notes/4
                return '';
            }
        }

        function renderInspectionSummary(value, action, obj) {
            if (action === 'display' && !_.isEmpty(obj)) {
                obj.LinkType = 'Inspection';
                obj.LinkId = obj.Id;
                value = value || obj.Summary;
                return renderColumnLink(value, action, obj);
            } else {
                return '';
            }
        }

        function renderTaskSummary(value, action, obj) {
            if (action === 'display' && !_.isEmpty(obj)) {
                obj.LinkType = 'Task';
                obj.LinkId = obj.Id;
                value = value || obj.Summary;
                return renderColumnLink(value, action, obj);
            } else {
                return '';
            }
        }

        function renderMessageSubject(value, action, obj) {
            if (action === 'display') {
                var label = value || obj.MessageScheduleName;

                if (obj.MessageType === 'Conversation') {
                    return '<a href="/#/message/thread/' + obj.Id + '">' + label + '</a>';
                } else if (obj.MessageType === 'Document' || obj.MessageType === 'Statement') {
                    return '<a href="api/comms/message/' + obj.Id + '/document" target="_blank">' + label + '</a>';
                } else {
                    return '<a class="open" href="">' + (obj.Subject || obj.MessageScheduleName) + '</a>'
                }

            } else {
                return value || obj.MessageScheduleName;
            }
        }
    }
}());