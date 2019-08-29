(function () {
    'use strict';
    var PM_LOCALE = 'en-au';
    var PM_REGION = 'AU_QLD';
    if (typeof PM_LOCALE === 'undefined') {
        var a = '';
        if (window && window.location && window.location.hash && window.location.hash.length > 0)
        {
            var r = encodeURIComponent(window.location.hash.slice(2));
            if (r && r.length > 0)
            {
                a = '?r=' + r;
            }
        }
        document.location = "/sign-in";
    } else {
         document.write('<script src="i18n/angular-locale_' + PM_LOCALE + '.js"><\/script>');
         document.write('<script src="i18n/date-' + PM_LOCALE + '.js"><\/script>');
        // if (PM_REGION) {
        //     document.write('<script src="api/meta/' + PM_REGION + '/helptext.js?v=' + PM_HELPTEXT_VERSION + '"><\/script>');
        // }
       // document.write('<script src="api/meta/helptext.js"><\/script>');
    }
})();
