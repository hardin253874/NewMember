import { TestBed, inject } from '@angular/core/testing';
import { AppWideEventService } from './app-wide-events.service';
import { PortalErrorHandlerService } from './portal-error-handler.service';

describe('PortalErrorHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppWideEventService, PortalErrorHandlerService]
    });
  });

  it('should ...', inject([PortalErrorHandlerService], (service: PortalErrorHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
