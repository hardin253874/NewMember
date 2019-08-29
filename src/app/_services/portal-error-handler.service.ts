import { Injectable, ErrorHandler }   from '@angular/core';
import { AppWideEventService }        from './app-wide-events.service';

@Injectable()
export class PortalErrorHandlerService implements ErrorHandler  {

  constructor(private eventService : AppWideEventService) {

  }

  handleError(error) {

    this.eventService.emitError(error);

    // do something with the exception

    console.log(error.message, error.stack);
  }

}
