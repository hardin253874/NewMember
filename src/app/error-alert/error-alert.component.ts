import { Component, OnInit, Input} from '@angular/core';
import { NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-alert',
  templateUrl: './error-alert.component.html',
  styleUrls: ['./error-alert.component.scss']
})
export class ErrorAlertComponent implements OnInit {
  @Input() error: ErrorData;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {

  }

}

export class ErrorData {

  constructor(public errorText: string, public title = 'Error') {

  }

}
