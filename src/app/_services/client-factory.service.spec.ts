import { TestBed, inject } from '@angular/core/testing';
import { AppWideEventService } from './app-wide-events.service';
import { PortalLocalStorage, PortalCookieStorage } from '../_common/portal-storage'
import { PortalSession } from '../_common/portal-session';
import { ClientFactoryService } from './client-factory.service';

describe('ClientFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppWideEventService, ClientFactoryService, PortalLocalStorage, PortalCookieStorage, PortalSession]
    });
  });

  it('should ...', inject([ClientFactoryService], (service: ClientFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
