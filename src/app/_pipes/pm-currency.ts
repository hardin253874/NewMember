import { PortalSession } from '../_common/portal-session';
import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { RegionSettings } from '../_common/region-settings';
@Pipe({
  name: 'pmCurrency'
})

export class PMCurrencyPipe implements PipeTransform {

  constructor(
    private portalSession: PortalSession ) {
  }

  transform(value?: number) {
    // need to show 0
    if ((!value || isNaN(Number(value))) && value !== 0) {
      return null;
    }

    const currencyCode = this.portalSession && this.portalSession.defaultAgent ?
      this.portalSession.defaultAgent.RegionSetting.CurrencyCode : 'AUD';
    const currentLanguage = this.portalSession && this.portalSession.currentLanguage ?
        this.portalSession.currentLanguage : 'en-AU';

      // {minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}
    const currencyDigitInfo = '1.2-2';
    let currencyValue = null;

    let currencyPipe = null;
    try {
        currencyPipe = new CurrencyPipe(currentLanguage);
        currencyValue = currencyPipe.transform(Number(value), currencyCode, true, currencyDigitInfo );
    } catch (e) {
        currencyPipe = new CurrencyPipe('en-AU');
        currencyValue = currencyPipe.transform(Number(value), 'AUD', true, currencyDigitInfo );
    }

    return !!currencyValue && currencyValue.charAt(0) === '-' ?
      '(' + currencyValue.substring(1, currencyValue.length) + ')' :
      currencyValue;
  }
}
