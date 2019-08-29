
import { ErrorHandler } from '@angular/core';
import { environment } from '../environments/environment';
//import * as rg4js from 'raygun4js';
declare var rg4js: RaygunV2;


rg4js('apiKey', environment.raygunKey);
rg4js('setVersion', environment.version);
rg4js('options', {
    excludedHostnames: ['\.local', '127.0.0.1'],
    ignore3rdPartyErrors: true,
    allowInsecureSubmissions: true,
    ignoreAjaxAbort: true,
    ignoreAjaxError: true });
rg4js('attach', true);
rg4js('enablePulse', true);
rg4js('enableCrashReporting', true);
rg4js('onBeforeSend', function (payload) {

    const errorCanBeIgnored = function(errorData) {
        let ignore = false;
        ignore = ignore || errorData.url && errorData.url.indexOf('heartbeat') > -1;
        ignore = ignore || (errorData.status && errorData.status === 401);
        ignore = ignore || (errorData.status && errorData.status === 403);
        ignore = ignore || (errorData.status && errorData.status === 404);

        return ignore;
    };

    const libErrorCanBeIgnored = function(errorDetails){
        if (!errorDetails || !errorDetails.Error || !errorDetails.Error.StackTrace){
            return false;
        }

        const libErrorStackTraces = errorDetails.Error.StackTrace.find(
            function(errorStackTrace) {
                return errorStackTrace.FileName && errorStackTrace.FileName.indexOf('/polyfills') > -1 ||
                    errorStackTrace.FileName && errorStackTrace.FileName.indexOf('/vendor') > -1 ;
            });

        return (libErrorStackTraces && libErrorStackTraces.length === errorDetails.Error.StackTrace.length);
    }

    if (errorCanBeIgnored(payload.Details.UserCustomData)) {
        // ignore the error
        return false;
    }


    if (libErrorCanBeIgnored(payload.Details)) {
        return false;
    }

    // continue with error reporting
    return payload;
});

export class RaygunErrorHandler implements ErrorHandler {
  handleError(e: any) {
    rg4js('send', {error: e});
  }
}
