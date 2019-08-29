import { RequestListBase } from '../_common/request-base';
import { PortalClientFactory } from '../_services';
import { DocumentInfo, DocumentInfoList } from './DocumentInfo';
import { ActivityFeedList } from '../activity-feed/services/activity-feed.service';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DocumentService {

  constructor(
    // private http: Http,
    private clientFactory: PortalClientFactory
    // private updateSubscrib:
  ) { }

  getTenantDocumentList(pageSize = 0, startPage = 0) : Promise<ActivityFeedList> {

    const client = this.clientFactory.createClient();
    if (client) {
      const request = new GetTenantDocumentList();
      request.PageSize = pageSize;
      request.StartPage = startPage;

      return client.get(request);

    }else {
      const emptyTenantDocumentList = new Promise<ActivityFeedList>(
        (resolve, reject) => {
          resolve(null);
        }
      );

      return emptyTenantDocumentList;
    }
  }

}

export class GetTenantDocumentList extends RequestListBase<ActivityFeedList> {
   getTypeName() { return 'GetTenantDocumentList'; }
}
