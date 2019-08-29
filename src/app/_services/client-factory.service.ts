import { PortalSession } from '../_common/portal-session';
import { AuthGuard } from '../_guards';
import { Injectable, Injector } from '@angular/core';
import { JsonServiceClient }                        from '@servicestack/client';
import { PortalServiceClient, PortalClientFactory } from './portal-client-factory';
import { ConnectStatusTypes }                       from './connect-status-types';
import { AppWideEventService }                      from './app-wide-events.service';
import { environment }                              from '../../environments/environment';

@Injectable()
export class ClientFactoryService  implements  PortalClientFactory {

  constructor(
    private eventService : AppWideEventService,
    private portalSession: PortalSession
  ) {

  }

  public createClient(ignore401 = false): PortalServiceClient {
    const client = new PortalServiceClient(environment.serverUrl, this.portalSession);

    client.status = ConnectStatusTypes.unknown;
    let msg = '';

    client.exceptionFilter = (res: Response, error: any) => {
      if (res != null) {
        msg = res.statusText;

        if (res.ok) {
          client.status = ConnectStatusTypes.ok;
        } else if (res.status === 401) {
          client.status = ConnectStatusTypes.unauthorized;
          if (!ignore401) {
          }
        } else if (res.status === 403) {
          client.status = ConnectStatusTypes.notPermitted;
        } else if (res.status === 503) {
          client.status = ConnectStatusTypes.unavailable;
        } else if (res.status === 500) {
          client.status = ConnectStatusTypes.crash;
        } else {
          client.status = ConnectStatusTypes.badRequest;
        }

      } else if (error.message === 'Failed to fetch') {
        if (!navigator.onLine) {
          client.status = ConnectStatusTypes.offline;
        } else {
          client.status = ConnectStatusTypes.unreachable;
        }
      } else {
        console.log(error);
        msg = error.toString();
      }

      if (ignore401 && client.status === ConnectStatusTypes.unauthorized) {

      } else if (client.status === ConnectStatusTypes.unreachable || client.status === ConnectStatusTypes.offline) {
          this.eventService.emitConnectStatus(client.status, msg);
      } else if (this.ignoreEmitConnectStatus(client, res)) {
          //  don't emit error message and show in page
      } else if (client.status !== ConnectStatusTypes.ok && client.status !== ConnectStatusTypes.badRequest) {
          this.eventService.emitConnectStatus(client.status, msg);
      }
    };

    return client;
  }

  // some error message is used to show in page, ignore to emit the error message
  public ignoreEmitConnectStatus(client, res) {
      let isIgnore = false;

      if (client.status === ConnectStatusTypes.crash && res != null && res.url.indexOf ('GetTenantTransactionHistory') > 0) {
          isIgnore = true;
      } else if (client.status === ConnectStatusTypes.badRequest && res != null && res.url.indexOf('RequestSignUpMember') > 0){
          isIgnore = true;
      }
      return isIgnore;
  }

}
