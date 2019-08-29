import { AppComponent } from '../app.component';
import { Component, OnInit }  from '@angular/core';
import { PortalSession } from '../_common/portal-session';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private rootComponent : AppComponent,
    public portalSession: PortalSession
  ) {
    rootComponent.showNavbar();
  }

  ngOnInit() {
  }

}
