import { Pipe, PipeTransform } from '@angular/core';
import { AddressDetail } from '../_common/address-detail';
import { PortalSession } from '../_common/portal-session';
@Pipe({
  name: 'addressText'
})

export class AddressTextPipe implements PipeTransform {
  constructor (private portalSession: PortalSession) {

  }

  public transform(lotId: string): string {

    if (!this.portalSession) {
      return null;
    }

    const tenant = this.portalSession.tenants.find(t => t.LotId === lotId);

    // address text only show unit, number, street and suburb.
    if (tenant) {
       return tenant.AddressText;
    }

    return '';
  }
}
