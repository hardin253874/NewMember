import { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import * as momenttz from 'moment-timezone';
@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  constructor () {}

  public transform(dateValue: string, showTimezone: boolean = false, timezoneName: string = ''): string {
    if (!dateValue) {
      return '';
    }

    const timeFormat = showTimezone ? 'h:mm a z' : 'h:mm a';
    if (timezoneName !== '') {
        return momenttz.tz(moment(dateValue).utc(), timezoneName).format(timeFormat);
    } else {
        return moment(dateValue).utc().format(timeFormat);
    }

  }
}
