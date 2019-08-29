import { UtilityService } from '../_common/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from '../agent-card/services/agent.service';
import { ClientFactoryService } from '../_services/client-factory.service';
import { TenancyInfo } from '../renting-card/services/tenancy.service';
import { PortalSession } from '../_services';
import { Component, OnInit }        from '@angular/core';
import { AppWideEventService }      from '../_services/app-wide-events.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  public isNavbarCollapsed = true;
  public showDropdown = true;
  version : number;
  unArchivedTenants:  TenancyInfo[];
  constructor(
    private eventService : AppWideEventService,
    private utility: UtilityService,
    public portalSession : PortalSession,

    private agentService : AgentService
  ) {

    eventService.newSessionEvent$.subscribe(event => {
      this.version++;
    });
  }

  ngOnInit() {
    this.version = 0;
    if ( this.portalSession &&  this.portalSession.tenants) {
        this.unArchivedTenants = this.portalSession.tenants.filter(t => !t.IsClosed);
    }
  }

  switchTenantTo(tenant: TenancyInfo) {
    this.showDropdown = true;

    if (this.portalSession.currentTenant.Id === tenant.Id) {
      return; // skip if it's the same tenant folio
    }

    const that = this;

    this.agentService.getCurrentAgent(tenant.Id)
      .then(agent => {
        that.portalSession.switchToTennant(tenant, agent);

        this.collapseMenu();

        // refresh and go home page
        this.utility.goHome();
      });
  }

  toggleDropdown() {
    this.showDropdown = false;
  }

  onSearch(value: string) {
   // todo implement search function later.
  }

  collapseMenu() {
    if (!this.isNavbarCollapsed) {
      this.isNavbarCollapsed = true;
    }
  }
}
