import { Injectable }           from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { PortalClientFactory }    from './portal-client-factory';
import { PingSec, PingResponse }    from '../model/ping-request';

@Injectable()
export class TestService {
  constructor(private clientFactory: PortalClientFactory) {

  }

  getPing (message: string): Promise<PingResponse> {
    const client = this.clientFactory.createClient();
    const request = new PingSec();
    request.Message = message;

    return client.get(request);
  }
}
