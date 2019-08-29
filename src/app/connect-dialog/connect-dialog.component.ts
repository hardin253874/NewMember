import { Component, OnInit, Input} from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ConnectStatusTypes} from '../_services/connect-status-types';


@Component({
  selector: 'app-connect-dialog',
  templateUrl: './connect-dialog.component.html',
  styleUrls: ['./connect-dialog.component.scss']
})
export class ConnectDialogComponent implements OnInit {
  @Input() model: ConnectData;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {

  }

}

export class ConnectData {

  constructor(public status: ConnectStatusTypes, public msg = '') {
    const firendlyErrorMessage = 'Services are temporarily unavailable';
    switch (status) {
      case ConnectStatusTypes.offline: {
        this.title = 'Offline';
        this.message = 'No internet connection';
        break;
      }
      case ConnectStatusTypes.unavailable: {
        this.title = 'Cloud Maintenance';
        this.message = firendlyErrorMessage;
        break;
      }
      case ConnectStatusTypes.crash: {
        this.title = 'Service Error';
        console.log(msg);
        this.message = 'A remote error occurred : ' + firendlyErrorMessage;
        break;
      }
      case ConnectStatusTypes.unauthorized: {
        this.title = 'Cloud Security';
        this.message = 'You need to sign in for access';
        break;
      }
      case ConnectStatusTypes.notPermitted: {
        this.title = 'Not Permitted';
        this.message = 'Preview mode is read only'; //'Contact your agent administrator for permissions';
        break;
      }
      case ConnectStatusTypes.badRequest: {
        this.title = 'User Error';
        this.message = msg;
        break;
      }
      case ConnectStatusTypes.unreachable: {
        this.title = 'Connection Problem';
        this.message = 'PropertyMe services are currently unreachable';
        break;
      }
      default: {  // unknown
        this.title = 'Error';
        console.log(msg);
        this.message = firendlyErrorMessage;
        break;
      }
    }
  }

  public title : string;
  public message : string;

}
