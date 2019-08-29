import { ListResponseBase } from '../_common/list-response-base';
import { BehaviorSubject } from 'rxjs/Rx';
import { ActivityFeedInfo, ActivityFeedList } from '../activity-feed/services/activity-feed.service';
import { RequestListBase } from '../_common/request-base';
import { PortalClientFactory } from '../_services';
import { Injectable } from '@angular/core';

@Injectable()
export class ActivityService {

  constructor(
    private clientFactory : PortalClientFactory
  ) { }

  getTenantActivityList(pageSize = 0, startPage = 0): Promise<ActivityList> {
    const client = this.clientFactory.createClient();

    if (client) {
      const request = new GetTenantActivityList();
      request.PageSize = pageSize;
      request.StartPage = startPage;

      return client.get(request);
    }else {
      const emptyTenantJobList = new Promise<ActivityList>((resolve, reject) => {
        resolve(null);
      });

      return emptyTenantJobList;
    }
  }
}

export class GetTenantActivityList  extends RequestListBase<ActivityList> {
   getTypeName() { return 'GetTenantActivityList'; }
}

export class ActivityList extends ListResponseBase<ActivityFeedInfo> {
  CurrentList : ActivityFeedInfo[];
 }
