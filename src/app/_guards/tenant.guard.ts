import { AuthGuard } from './auth.guard';
import { PortalSession } from '../_common/portal-session';
import { Injectable }               from '@angular/core';
import { Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot }             from '@angular/router';

@Injectable()
export class TenantGuard extends AuthGuard {

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (super.canActivate(route, state)) {


     let currentTenant = this.portalSession.currentTenant;
     if (!currentTenant) {
         this.portalSession.setCurrentTenant();
         currentTenant = this.portalSession.currentTenant;
     }

      if (currentTenant) {
        return true;
      } else {
        this.router.navigate(['/member/profile']);
        return false;
      }
    }
  }
}
