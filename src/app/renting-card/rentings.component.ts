import { PortalSession } from '../_common/portal-session';
import { Component, OnInit, Input } from '@angular/core';
import { TenancyInfo, GetTenantResponse}    from './services/tenancy.service';
@Component({
  selector: 'app-rentings',
  templateUrl: './rentings.component.html',
  styleUrls: ['./rentings.component.scss']
})
export class RentingsComponent implements OnInit {

  @Input() isSummary: boolean;

  constructor(
    public portalSession : PortalSession
  ) { }

  ngOnInit() {
  }
}
