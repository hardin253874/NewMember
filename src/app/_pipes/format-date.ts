import { PortalSession } from '../_common/portal-session';
import { DatePipe } from '@angular/common';
import { SessionInfo } from '../_services';
import { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  constructor (private portalSession: PortalSession) {

  }

  public transform(dateValue: string, shortFormat: boolean, showYear: boolean = true): string {
    if (!dateValue) {
      return '';
    }

    let dateFormat = this.portalSession && this.portalSession.defaultAgent ?
      this.portalSession.defaultAgent.RegionSetting.DateFormatClient.toUpperCase() : 'd MMMM YYYY';

    if (shortFormat) {
        dateFormat = dateFormat.replace('MMMM', 'MMM');
    }

    if (!showYear) {
        dateFormat = dateFormat.replace('YYYY', '');
    }



    return moment(dateValue).format(dateFormat);

  }
}
