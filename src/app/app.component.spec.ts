import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppWideEventService } from './_services/app-wide-events.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { UtilityService } from './_common/utility.service';
import { PortalClientFactory } from './_services/portal-client-factory';
import { AuthenticationService } from './_services/authentication.service';
import { TenancyService } from './renting-card/services/tenancy.service';
import { AgentService } from './agent-card/services/agent.service';
import { PortalSession } from './_common/portal-session';
import { ToastMessageService } from './_services/toast-message.service';
import { RouterExtService } from './_services/router-ext.service';
import { HttpModule, ConnectionBackend, Jsonp } from '@angular/http';
import {ToastyModule, ToastyService} from 'ng2-toasty';
import { PortalLocalStorage, PortalCookieStorage} from './_common/portal-storage';
describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ AppWideEventService, UtilityService, PortalClientFactory, PortalSession, PortalLocalStorage, PortalCookieStorage,
          AuthenticationService, TenancyService, AgentService, Jsonp, ConnectionBackend, ToastMessageService,
          ToastyService, RouterExtService],
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [NgbModule.forRoot(), ToastyModule.forRoot(), RouterTestingModule, HttpModule ]
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app works!'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    // expect(app.title).toEqual('app works!');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    // expect(compiled.querySelector('h1').textContent).toContain('app works!');
  }));
});
