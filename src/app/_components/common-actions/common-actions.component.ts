import { PortalSession } from '../../_services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-common-actions',
  templateUrl: './common-actions.component.html',
  styleUrls: ['./common-actions.component.scss']
})
export class CommonActionsComponent implements OnInit {
  isClosed: boolean;
  constructor(
    private session : PortalSession
  ) { }

  ngOnInit() {
      this.isClosed = false;
      if (this.session && this.session.currentTenant) {
          this.isClosed = this.session.currentTenant.IsClosed;
      }
  }

  messageAgent() {
    window.location.href = 'mailto:' + this.session.defaultAgent.ToAgentEmail;
  }
}
