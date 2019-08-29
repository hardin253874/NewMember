(function(){
    'use strict';

    var app = angular.module('app');

    app.factory('httpRequestInterceptor', [interceptHttpRequest]);

    function interceptHttpRequest() {
        return {
            request: function (request) {
                request.headers = request.headers || {};
                // bootstrap template
                if(request.url.startsWith('uib/template') ||
                    request.url.startsWith('tab/tab')) {
                    //Not modifying requests to these urls,
                    //as they are angular template cache requests
                    return request;
                } else {
                    //Do the interceptor work here - add page version
                    if (request.method === 'GET' && request.url.substr(request.url.length - 5) === '.html') {
                        request.url = request.url + '?v=' + PM_VERSION;
                    }
                    return request;
                }
            }
        };
    }

})();