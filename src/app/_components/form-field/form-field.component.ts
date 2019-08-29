
import { Component, Input, OnInit, ElementRef, ContentChild } from '@angular/core';
import { NgModel } from '@angular/forms';


@Component({
  selector: 'form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss']
})

export class FormFieldComponent implements OnInit {

  @Input() label: string;

  @ContentChild(NgModel) state;

  constructor(private element : ElementRef) {

  }

  ngOnInit() {

  }

  isStateNotValid() {
    return this.label && this.state && !this.state.pristine && !this.state.valid; // && !this.state.control.pending;
  }

}
