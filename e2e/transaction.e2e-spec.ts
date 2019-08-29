import { browser, element, by } from 'protractor';
import { MemberPortalPage } from './app.po';

export class TranscationTestService {
  transcationSpecTest() {
    describe('tenant transaction page', () => {
      let page: MemberPortalPage;

      beforeEach(() => {
        page = new MemberPortalPage();
      });

      it('access transaction page', () => {
        page.accessPageByNavCard('Transactions');
      });


      it ('transaction page contains components', () => {
        expect(element(by.tagName('app-renting-card'))).toBeDefined();
        // expect(element(by.tagName('app-nav-card'))).toBeDefined();
        expect(element(by.tagName('app-common-actions'))).toBeDefined();
        expect(element(by.tagName('app-payment-history-chart'))).toBeDefined();
        expect(element(by.tagName('app-transaction-history'))).toBeDefined();
      });

      it ('transaction page contains title', () => {

        const rentHistoryArea = element(by.css('[role="rent-history"]'));
        expect(rentHistoryArea).toBeDefined();
        const titleElement = rentHistoryArea.element(by.tagName('h5'));
        expect(titleElement).toBeDefined();

        titleElement.getText().then(
          function(text){
            expect(text.trim()).toEqual('Rent History');
          }
        )
      })
    });
  }
}


