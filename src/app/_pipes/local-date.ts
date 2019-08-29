import { PortalSession } from '../_common/portal-session';
import { DatePipe } from '@angular/common';
import { SessionInfo } from '../_services';
import { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import * as moment from 'moment';
import * as momenttz from 'moment-timezone';
@Pipe({
    name: 'localDate'
})
export class LocalDatePipe implements PipeTransform {

    constructor (private portalSession: PortalSession) {

    }

    public transform(dateValue: string, shortFormat: boolean): string {
      if (!dateValue) {
        return '';
      }

      let dateFormat = this.portalSession && this.portalSession.defaultAgent ?
      this.portalSession.defaultAgent.RegionSetting.DateFormatClient.toUpperCase() : 'd MMMM YYYY';

      if (shortFormat) {
        dateFormat = dateFormat.replace('MMMM', 'MMM');
      }

      if (this.portalSession && this.portalSession.defaultAgent &&
          this.portalSession.defaultAgent.RegionSetting.Country &&
          this.portalSession.defaultAgent.RegionSetting.RailsTzName) {
          const tz =  this.portalSession.defaultAgent.RegionSetting.Country + '/' +
                      this.portalSession.defaultAgent.RegionSetting.RailsTzName;
          return momenttz.tz(dateValue, tz).locale(this.portalSession.currentLanguage).format(dateFormat);
      } else {
          return moment(dateValue).locale(this.portalSession.currentLanguage).format(dateFormat);
      }
    }
}
