import { ActivityFeedInfo, ActivityFeedList } from '../activity-feed/services/activity-feed.service';
import { RequestListBase } from '../_common/request-base';
import { ListResponseBase } from '../_common/list-response-base';
import { PortalClientFactory } from '../_services';
import { Injectable } from '@angular/core';

@Injectable()
export class UpcomingEventService {

  constructor(
    private clientFactory: PortalClientFactory
  ) { }

  getUpcomingEvents(pageSize= 0, startPage= 0) : Promise<ActivityFeedList> {
    const client = this.clientFactory.createClient();
    if (client) {
      const request = new GetTenantComingEventList();
      request.PageSize = pageSize;
      request.StartPage = startPage;

      return client.get(request);
    } else {
      return new Promise<ActivityFeedList> (
        (resolve, reject) => {
          resolve(null);
        }
      );
    }
  }
}

export class GetTenantComingEventList extends RequestListBase<ActivityFeedList> {
  getTypeName() { return 'GetTenantUpcomingEventList'};
}
