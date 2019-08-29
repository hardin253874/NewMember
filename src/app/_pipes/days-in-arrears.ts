import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
  name: 'daysInArrears'
})


export class DaysInArrearsPipe implements PipeTransform {
  public transform(date: Date): number {
    if (date) {
      return -moment().diff(date, 'days');
    }

    return null;
  }
}
