import { Subscription } from 'rxjs/Rx';
import { JobService } from '../jobs/services/job.service';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService }    from '../_services/index';
import { ActivityFeed, ActivityFeedInfo, ActivityFeedList, ActivityFeedService, FeedTypes } from './services/activity-feed.service';
import { IPortalStorage, PortalLocalStorage, PortalCookieStorage } from '../_common/portal-storage-index';
import { AgentInfo } from '../agent-card/services/agent.service';

@Component({
  selector: 'app-activity-feed',
  templateUrl: './activity-feed.component.html',
  styleUrls: ['./activity-feed.component.scss']
})
export class ActivityFeedComponent implements OnInit {
  isLoaded = false;
  activityFeeds : ActivityFeedInfo[];
  mergedActivityFeeds : ActivityFeedInfo[];
  paymentFeeds: ActivityFeedInfo[];
  agentInfo: AgentInfo;
  listInfo : ActivityFeedList;
  pageSize = 10;
  private subscription: Subscription;
  public portalStorage :  IPortalStorage;

  constructor(
    private authenticationService : AuthenticationService,
    private activityFeedService: ActivityFeedService,
    private jobService: JobService
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

  }


  ngOnInit() {
    this.agentInfo = this.authenticationService.loadDefaultAgent();

    this.subscription = this.jobService.dataChange$.subscribe( (newNumber) => {
      this.activityFeeds = [];
      this.loadNextPageData();
    });
  }

  private loadNextPageData () {
    const startPage = this.listInfo && this.listInfo.StartPage ? this.listInfo.StartPage : 0;

    const that = this;
    this.activityFeedService.getActivityFeedList(this.pageSize, startPage)
      .then(r => this.prepareActivityFeedData(that, r))
      .catch(err => {

      });
  }

  ngOnDestory() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  private prepareActivityFeedData(comp: ActivityFeedComponent, response: ActivityFeedList) {
    comp.isLoaded = true;
    comp.activityFeeds.push.apply(comp.activityFeeds, response.List);
    comp.listInfo = response;
    comp.mergeActivityFeeds();
    comp.setPaymentFeed();
  }

  showMore() {
    if (this.listInfo && this.listInfo.TotalRecords > this.activityFeeds.length) {
      this.listInfo.StartPage ++;

      this.loadNextPageData();
    }
  }

  showAll() {
    if (this.listInfo && this.listInfo.TotalRecords > this.activityFeeds.length) {
      this.listInfo.StartPage ++;

      const that = this;
      this.activityFeedService.getActivityFeedList()
        .then(r => this.prepareActivityFeedData(that, r))
        .catch(err => {
      });
    }
  }

  mergeActivityFeeds () {

    const thisComp = this;  // Is this alia realy required in TS?
    if (thisComp.activityFeeds) {
      let lastFeedIndex = 0;
      thisComp.mergedActivityFeeds = new Array<ActivityFeedInfo>();

      thisComp.activityFeeds.forEach( function(feedItem, i) {
          const index = thisComp.mergedActivityFeeds.length - 1;
          if (index >= 0 && thisComp.compareActivityPaymentFeed(thisComp.mergedActivityFeeds[index], feedItem)) {

            if (!thisComp.mergedActivityFeeds[index].childFeeds) {
              thisComp.mergedActivityFeeds[index].childFeeds = new Array<ActivityFeedInfo>();
            }
            thisComp.mergedActivityFeeds[index].childFeeds.push(feedItem);
          } else {
            thisComp.mergedActivityFeeds.push(feedItem);
            lastFeedIndex = i;
          }
      });
      thisComp.isLoaded = true;
    }
  }

  setPaymentFeed() {
    this.paymentFeeds = this.mergedActivityFeeds.filter(feed => feed.FeedType === 'PaymentInfo');
     this.portalStorage.set('paymentFeeds', JSON.stringify(this.paymentFeeds));
    // localStorage.setItem('paymentFeeds', JSON.stringify(this.paymentFeeds));
  }

  compareActivityPaymentFeed(lastItem : ActivityFeedInfo, currentItem : ActivityFeedInfo) {
    if (lastItem &&
        currentItem &&
        currentItem.FeedType === 'PaymentInfo' &&
        lastItem.FeedType === currentItem.FeedType &&
        lastItem.FeedInfo &&
        currentItem.FeedInfo &&
        lastItem.FeedInfo['JournalId'] === currentItem.FeedInfo['JournalId']
    ) {
      return true;
    } else {
      return false;
    }
  }
}
