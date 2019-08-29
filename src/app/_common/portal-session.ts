import { TenancyInfo, TenancyListInfo } from '../renting-card/services/tenancy.service';
import { AgentInfo } from '../agent-card/services/agent.service';
import { ConnectStatusTypes }       from '../_services/connect-status-types';
import { Injectable } from '@angular/core';
import { AppWideEventService }      from '../_services/app-wide-events.service';
import {IPortalStorage, PortalLocalStorage, PortalCookieStorage} from './portal-storage-index';
import * as moment from 'moment';
import { Moment } from 'moment';
import { environment } from '../../environments/environment';
@Injectable()
export class PortalSession {
    // it's singleton service, to solve the cycle dependcy

    public session: SessionInfo
    public defaultAgent: AgentInfo;
    public tenants: TenancyInfo[];
    public currentTenant : TenancyInfo;
    public currentLanguage : string;
    public hasMultipleProperties = false;
    public isPreview = false;
    public ownerAccess = false;
    public bingSessionId : string;
    public portalStorage :  IPortalStorage;
    constructor(
        private eventService : AppWideEventService
    ) {

        let localStorageSupported = true;

        try {
            localStorageSupported = window != null && 'localStorage' in window &&
                typeof window['localStorage'] !== 'undefined' &&
                window['localStorage'] !== null;

            if (localStorageSupported) {
                localStorage.setItem('support', 'true');
                localStorage.removeItem('support');
            }
        } catch (ex) {
            localStorageSupported = false;
        }

        this.portalStorage = localStorageSupported ? new PortalLocalStorage() : new PortalCookieStorage();

        this.loadSession();

        this.loadStoredTenants();

        this.loadDefaultAgent();

        this.setCurrentLanguage();
    }

    loadStoredTenants() {
        const jsonData = this.portalStorage.get('tenantList'); // localStorage.getItem('tenantList');
        if (jsonData) {
            this.tenants = JSON.parse(jsonData);

            if (this.tenants && this.tenants.length > 0) {
                this.setCurrentTenant();
                this.triggerCurrentTennat();
            }
        }else {
            // todo: event to refresh app
            this.tenants = [];
        }

        this.setHasMultipleProperties();
        return this.tenants;
    }

    setHasMultipleProperties() {
        this.hasMultipleProperties = this.tenants && this.tenants.length > 1;
    }

    loadDefaultAgent(): AgentInfo {
        const agentString = this.portalStorage.get('defaultAgent');
        if (agentString) {
            const agent = JSON.parse(agentString);

            this.defaultAgent = agent;
        }
        return null;
    }

    setDefaultAgent(agent: AgentInfo) {
        this.defaultAgent = agent;
        if (agent) {
            this.portalStorage.set('defaultAgent', JSON.stringify(agent));
        }else {
            this.portalStorage.reset('defaultAgent');
        }

        this.eventService.emitDefaultAgentEvent(agent);
    }

    setTenantList(tenants: TenancyInfo[]) {
        if (tenants && tenants.length > 0) {
            this.portalStorage.set('tenantList', JSON.stringify(tenants));

            this.tenants = tenants;

            this.setCurrentTenant();
            this.triggerCurrentTennat();
            this.setHasMultipleProperties();
        } else {
            // reset session existing tenant value
            this.portalStorage.reset('tenantList');
            this.tenants = null;
            this.currentTenant = null;
            this.hasMultipleProperties = false;
        }
    }

    setOwnerAccess(ownerAccess: boolean) {
        this.loadSession();
        if (this.session) {
            this.session.OwnerAccess = ownerAccess;
            this.portalStorage.set('currentSession', JSON.stringify(this.session));
        }

        this.ownerAccess = ownerAccess;
    }

    triggerCurrentTennat() {
        // trigger event
        this.eventService.emitCurrentTenantEvent(this.currentTenant);
    }

    loadSession() : SessionInfo {
        const sessString = this.portalStorage.get('currentSession');
        if (sessString) {
            this.session = JSON.parse(sessString);
            this.isPreview = this.session.IsPreview;
            this.ownerAccess = this.session.OwnerAccess;
            // this.bingSessionId = this.session.BingSessionId;
        }

        return this.session;
    }

    setSession(displayName : string, username : string, isPreview : boolean, ownerAccess : boolean) {
        const sessionDuration = environment.sessionDuration ? environment.sessionDuration : 9;
        const session = new SessionInfo(displayName, username, moment().add(sessionDuration, 'minute'), null, isPreview, ownerAccess, null, null);
        this.session = session;
        this.isPreview = isPreview;
        this.ownerAccess = ownerAccess;
        this.bingSessionId = null;
        this.portalStorage.set('currentSession', JSON.stringify(this.session));
        this.eventService.emitNewSession(session);
    }

    // Reload the session from a page refresh or from signing from the sign in page
    setSessionExpire() {
        if (this.session) {
            const diffInMs = moment.duration(moment(this.session.ExpiresAt).diff(moment())).asMilliseconds();

            // Prompt to sign in again when we expect the session will expire
            setTimeout(() =>
                    // this.eventService.emitSignInEvent()
                    this.eventService.emitConnectStatus(ConnectStatusTypes.unauthorized, 'Your session has expired')
                , diffInMs);

            setTimeout( () =>
                    this.eventService.emitCheckAppVersion()
                , diffInMs - 30000); //30 seconds before session expired

        }
    }

    removeSession() {
        this.portalStorage.remove('currentSession');
        this.portalStorage.remove('defaultAgent');
        this.portalStorage.remove('tenantList');
        // localStorage.removeItem('currentSession');
        // localStorage.removeItem('defaultAgent');
        // localStorage.removeItem('tenantList');
        this.session = null;
        this.tenants = null;
        this.defaultAgent = null;
        this.currentTenant = null;
        this.hasMultipleProperties = false;
    }

    switchToTennant(tenant : TenancyInfo, agent : AgentInfo) {
        if (tenant) {
            this.currentTenant = tenant;

            this.session.CurrentFolioId = tenant.Id;
            this.portalStorage.set('currentSession', JSON.stringify(this.session));

            this.triggerCurrentTennat();
        }

        if (agent) {
            this.setDefaultAgent(agent);
            this.setCurrentLanguage();
        }

        // this.appRef.tick();
    }

    setCurrentTenant() {
        if (!this.session) {
            this.loadSession();
        }

        if (!this.tenants) {
            this.loadStoredTenants();
        }
        // set current folio id, if needs
        if (this.session && this.tenants && this.tenants.length > 0) {
            if (this.tenants.length > 0) {
                if (!this.session.CurrentFolioId) {
                    // choose the first one by default
                    this.currentTenant = this.tenants[0];
                    this.session.CurrentFolioId = this.tenants[0].Id;
                }else {
                    this.currentTenant = this.tenants.find(t => t.Id === this.session.CurrentFolioId);
                }
            }
        }
    }

    setCurrentLanguage() {
        if (this.defaultAgent && this.defaultAgent.RegionSetting) {
            this.currentLanguage =  this.defaultAgent.RegionSetting.Locale;
        }else {
            this.currentLanguage = 'en-au';
        }
    }

    /*
    setBingMapSession(sessionId : string) {

        if (this.session) {
            this.session.BingSessionId = sessionId;
        }

        this.bingSessionId = sessionId;

    }
    */
}

export class SessionInfo {
    constructor (public DisplayName : string,
                 public UserName : string,
                 public ExpiresAt : Moment,
                 public CurrentFolioId : string,
                 public IsPreview : boolean,
                 public OwnerAccess : boolean,
                 public TermsVersion: string,
                 public AcceptConditionsVersion : string
                 // public BingSessionId : string
    )  { }

}

