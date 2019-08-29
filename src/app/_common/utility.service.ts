import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {PortalClientFactory, PortalResponse}    from '../_services/portal-client-factory';
import {FolioRequestBase} from "./request-base";
import {PortalSession} from './portal-session';
import * as moment from "moment";
@Injectable()
export class UtilityService {
    constructor(
        private router: Router,
        private portalSession: PortalSession,
      private clientFactory: PortalClientFactory
    ) {
    }

    refreshCurrentRoute() {
        const url = this.router.url;
        this.router.navigateByUrl(url);
    }

    reloadWholeApplication() {
        location.reload();
    }

    goHome() {
       this.router.navigate(['/']);
    }

    goProperty() {
      this.router.navigate(['/member/property']);
    }

    getCurrentAppVersion() : Promise<SettingResponse>{
      const client = this.clientFactory.createClient();
      const request = new GetCurrentAppVersion();

      if (client) {
        return client.get(request);
      }else {
        return null;
      }
    }

    sessionExpired() {
        if (!this.portalSession || !this.portalSession.session || !this.portalSession.session.ExpiresAt) {
            return true;
        }
        const diffInS = moment.duration(moment(this.portalSession.session.ExpiresAt).diff(moment())).asSeconds();
        return diffInS < 0;
    }
}



// @Route("/api/settings/current-app-version")
export class GetCurrentAppVersion extends FolioRequestBase<SettingResponse> {
  getTypeName() { return 'GetCurrentAppVersion'; }
}


export class SettingResponse {
  Version: string
}
