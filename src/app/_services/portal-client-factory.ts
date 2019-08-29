import { PortalSession } from '../_common/portal-session';
//import { IReturn } from 'servicestack-client';
import { AuthGuard } from '../_guards';
import { FolioRequestBase, RequestListBase } from '../_common/request-base';
import { Injectable, Injector } from '@angular/core';
import { ConnectStatusTypes } from './connect-status-types';
//import { JsonServiceClient, ResponseStatus }  from 'servicestack-client';
import { JsonServiceClient, ResponseStatus, IReturn } from '@servicestack/client';

export class PortalServiceClient extends JsonServiceClient {

  public status: ConnectStatusTypes;

  constructor(
    baseUrl : string,
    private portalSession : PortalSession
  ) {
    super(baseUrl);
  }

  public get<T>(request: IReturn<T> | string, args?: any): Promise<T> {
    if (typeof(request) !== 'string') {

      const myNewRequest = request as FolioRequestBase<T>;
      if (myNewRequest !== undefined && myNewRequest.FolioId !== undefined) {
        // still let it could request another folio rather than current folio
        if ( myNewRequest.FolioId === null || myNewRequest.FolioId.length < 36 ) {

          // reset session currentFolioId when it's null
          const session = this.portalSession.session;

          if (session && !session.CurrentFolioId) {
              this.portalSession.setCurrentTenant();
          }


          myNewRequest.FolioId = session ? session.CurrentFolioId : null;
          return super.get(myNewRequest, args);
        }
      }
    }

    return super.get(request, args);
  }
}

export class PortalClientFactory {

  createClient(ignore401 = false): PortalServiceClient { return null; }

}

export class PortalResponse {

  public IsSuccessful    : boolean;
  public ResponseStatus  : ResponseStatus;
}
