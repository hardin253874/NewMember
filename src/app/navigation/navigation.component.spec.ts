import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ServerUrlPipe, PMCurrencyPipe } from '../_pipes/index';
import { AppWideEventService } from '../_services/app-wide-events.service';
import { NavigationComponent } from './navigation.component';
import { UtilityService } from '../_common/utility.service';
import { RouterTestingModule } from '@angular/router/testing';
import { PortalLocalStorage, PortalCookieStorage } from '../_common/portal-storage'
import { PortalSession } from '../_common/portal-session';
import { AgentService } from '../agent-card/services/agent.service';
import { PortalClientFactory } from '../_services/portal-client-factory';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerUrlPipe, PMCurrencyPipe,  NavigationComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [RouterTestingModule],
      providers: [AppWideEventService, UtilityService, PortalSession, PortalLocalStorage, PortalCookieStorage,
        AgentService, PortalClientFactory]
    })
    .overrideComponent(NavigationComponent, {set: {template: ''}});
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
