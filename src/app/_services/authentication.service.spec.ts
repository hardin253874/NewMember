import { TestBed, inject } from '@angular/core/testing';
import { PortalClientFactory } from './portal-client-factory';
import { AppWideEventService } from '../_services/app-wide-events.service';
import { AgentService } from '../agent-card/services/agent.service';
import { AuthenticationService } from './authentication.service';
import { PortalLocalStorage, PortalCookieStorage } from '../_common/portal-storage'
import { PortalSession } from '../_common/portal-session';
import { TenancyService } from '../renting-card/services/tenancy.service';
import { UtilityService } from '../_common/utility.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, ConnectionBackend, Jsonp } from '@angular/http';
describe('AuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpModule],
      providers: [PortalClientFactory, AppWideEventService, Jsonp, ConnectionBackend,
        AgentService, AuthenticationService, PortalSession, PortalLocalStorage, PortalCookieStorage, TenancyService, UtilityService]
    });
  });

  it('should ...', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));
});
