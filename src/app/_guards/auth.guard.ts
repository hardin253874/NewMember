import { PortalSession } from '../_common/portal-session';
import { Injectable }               from '@angular/core';
import { Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot }             from '@angular/router';
import * as moment from 'moment';
import { ConnectStatusTypes }       from '../_services/connect-status-types';
import { AppWideEventService }      from '../_services/app-wide-events.service';
import { AuthenticationService }    from '../_services/authentication.service';
import { UtilityService } from '../_common/utility.service';
import {AgentInfo} from '../agent-card/services/agent.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    protected router: Router,
    protected portalSession : PortalSession,
    private eventService : AppWideEventService,
    private utilityService: UtilityService,
    private authService : AuthenticationService) {

    // Set the session when the user signs in
    eventService.newSessionEvent$.subscribe(event => this.portalSession.setSessionExpire());
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (!this.portalSession.session) {
      this.portalSession.setSessionExpire();
    }

    if (!this.utilityService.sessionExpired() ) {
      // logged in so return true
      return true;
    } else if ( state.url.startsWith('?token=')) {
      return true;
    }else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/sign-in'], {queryParams: {returnUrl: state.url}});
      return false;
    }


  }
}
