import { TransactionsService } from '../../transactions/transactions.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TenancyService } from '../../renting-card/services/tenancy.service';
import { PortalClientFactory } from '../../_services/portal-client-factory';
import { PaymentHistoryChartComponent } from './payment-history-chart.component';
import { PortalLocalStorage, PortalCookieStorage } from '../../_common/portal-storage'
import { PortalSession } from '../../_common/portal-session';
import { AppWideEventService } from '../../_services/app-wide-events.service';

describe('PaymentHistoryChartComponent', () => {
  let component: PaymentHistoryChartComponent;
  let fixture: ComponentFixture<PaymentHistoryChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentHistoryChartComponent ],
      providers: [TenancyService, PortalClientFactory, PortalSession, PortalLocalStorage, PortalCookieStorage,
        AppWideEventService, TransactionsService]
    })
      .overrideComponent(PaymentHistoryChartComponent, {set: {template: ''}});
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentHistoryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
