import { UtilityService } from '../_common/utility.service';

import { TenancyListInfo, TenancyService } from '../renting-card/services/tenancy.service';
import { PortalSession, SessionInfo } from '../_common/portal-session';
import { Injectable }                           from '@angular/core';
import { PortalClientFactory }                  from './portal-client-factory';
import { AppWideEventService }                  from '../_services/app-wide-events.service';
import { Authenticate, AuthenticateResponse, AgentPreviewAuthRequest,
    PortfolioResponse, PortfolioRequest, PortalSessionRequest, PortalSessionResponse }   from './authentication.model';
import { Moment }                               from 'moment';
import { AgentService, AgentInfo }              from '../agent-card/services/agent.service';
import { environment }                              from '../../environments/environment';
import { Http, Response,Jsonp } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {map} from 'rxjs/operator/map';
import {toPromise} from 'rxjs/operator/toPromise';
declare var rg4js: RaygunV2;

@Injectable()
export class AuthenticationService {
    constructor(
        private clientFactory: PortalClientFactory,
        private eventService: AppWideEventService,
        private portalSession: PortalSession,
        private tenantService : TenancyService,
        private utility : UtilityService,
        private agentService: AgentService,
        private jsonp: Jsonp) {  }


    login(username: string, password: string, refresh = false) : Promise<AuthenticateResponse> {
        // remove user from local storage to log user out
        this.portalSession.removeSession();
        const request = new Authenticate();
        const portlSessionRequest = new PortalSessionRequest();
        request.UserName = username;
        request.Password = password;

        const client = this.clientFactory.createClient(true);

        const that = this;

        let hasFolioAccess = true;
        return client.post(request)
            .then((response: AuthenticateResponse) => {
                // Don't store session id's in local storage!
                if (response) {
                    that.portalSession.setSession(response.DisplayName, response.UserName, false, false);
                    if (response.Meta && response.Meta['HasFolioAccess'] === 'True') {
                        hasFolioAccess = true;
                    } else {
                        hasFolioAccess = false;
                    }
                    if (response.ReferrerUrl) {
                        that.portalSession.setOwnerAccess(true);
                        that.setServerUrlCookie();
                    }

                }
                return response;
            })
            .then ( (authenResponse: AuthenticateResponse) => {
                if (hasFolioAccess) {
                    return client.get(portlSessionRequest)
                        .then( (portalSessionResponse: PortalSessionResponse) => {
                            if (portalSessionResponse) {
                                that.portalSession.setTenantList(portalSessionResponse.TenancyList);
                                that.portalSession.setDefaultAgent(portalSessionResponse.Agent);
                            }
                            return authenResponse;
                        })
                }
            });
    }

    previewLogin(token : string, referrerUrl: string) : Promise<AuthenticateResponse> {
        // remove user from local storage to log user out
        this.portalSession.removeSession();

        const client = this.clientFactory.createClient(true);
        const request = new AgentPreviewAuthRequest();
        const portlSessionRequest = new PortalSessionRequest();
        request.Token = token;
        request.ReferrerUrl = referrerUrl;

        if (client) {
            const that = this;

            return client.post(request)
                .then((response: AuthenticateResponse) => {
                    // Don't store session id's in local storage!
                    if (response) {
                        that.portalSession.setSession(response.DisplayName, response.UserName, true, false);
                    }
                    if (response.ReferrerUrl) {
                        that.setServerUrlCookie();
                        window.location.href = response.ReferrerUrl;
                    }else {
                        return response;
                    }
                })
                .then ( (authenResponse: AuthenticateResponse) => {
                    return client.get(portlSessionRequest)
                        .then( (portalSessionResponse: PortalSessionResponse) => {
                            if (portalSessionResponse) {
                                that.portalSession.setTenantList(portalSessionResponse.TenancyList);
                                that.portalSession.setDefaultAgent(portalSessionResponse.Agent);
                            }
                            return authenResponse;
                        })
                })
                .catch((err: any) => {
                    console.log(err);
                    return null;
                });
        }else {
            return new Promise<AuthenticateResponse>((resolve, reject) => {
                resolve(null);
            });
        }
    }

    getPortfolioByCode(code: string) : Promise<PortfolioResponse> {
        const client = this.clientFactory.createClient(true);
        const request = new PortfolioRequest();
        request.Code = code;

        if (client) {
            const that = this;

            return client.post(request)
                .then(( response: PortfolioResponse ) => {
                    return response;
                })
                .catch((err: any) => {
                    console.log(err);
                    return null;
                });

        }else {
            return new Promise<PortfolioResponse>((resolve, reject) => {
                resolve(null);
            });
        }
    }

    logout(removeSession: boolean = true) {
        // remove user from local storage to log user out
        if (removeSession) {
            this.portalSession.removeSession();
        }

        const client = this.clientFactory.createClient(true);
        const request = new Authenticate();
        request.Provider = 'logout';

        if (client) {
            return client.post(request)
                .then((response : AuthenticateResponse) => {
                })
                .catch((err: any) => {
                    console.log(err);
                });
        } else {
            return new Promise((resolve, reject) => {
                resolve(null);
            }).then(() => {
            });
        }
    }

    // please use this.portalSession.defaultAgent
    loadSession() : SessionInfo {
        return this.portalSession.session;
    }

    // please use this.portalSession.defaultAgent
    loadDefaultAgent(): AgentInfo {
        return this.portalSession.defaultAgent;
    }

    setServerUrlCookie() {
        document.cookie = 'serverUrl=' + environment.serverUrl;
    }
}




