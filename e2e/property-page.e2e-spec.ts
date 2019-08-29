import { browser, element, by } from 'protractor';
import { MemberPortalPage } from './app.po';
import { LocalDatePipe} from '../src/app/_pipes/index';
import { DatePipe, CurrencyPipe } from '@angular/common';

export class PropertyTestService {
  propertySpecTest() {
    describe('tenant property card', () => {
      let page: MemberPortalPage;
      let originalTimeout;
      beforeEach(() => {

        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        page = new MemberPortalPage();

      });

      afterEach(function() {

      });

      it('home page click property link to property page', () => {
        const propertyCardComponent = browser.element(by.tagName('app-renting-card'));
        expect(propertyCardComponent).toBeDefined();

        const titleControl = propertyCardComponent.element(by.tagName('h5'));
        const propertyLinkControl = titleControl.element(by.tagName('a'));

        propertyLinkControl.click();
      });

      it ('Access property page', () => {
        browser.getCurrentUrl().then((url) => {
          expect(url).toEqual(page.getBaseUrl() + 'member/property');

          const propertyComponent = element(by.tagName('app-renting-card'));
          expect(propertyComponent).toBeDefined();
          expect(element(by.tagName('app-agent-card'))).toBeDefined();
        });
      });

      it ('Property page contains title', () => {
        const propertyComponent = element(by.tagName('app-renting-card'));
        const titleControl = propertyComponent.element(by.css('.card-title.h5'));
        expect(titleControl).toBeDefined();
      });

      it ('Property page contains property details', () => {
        const propertyComponent = element(by.tagName('app-renting-card'));

        // propertyComponent.all(by.css('.row')).then((rows) => {
        //   expect(rows.length).toBeGreaterThanOrEqual(1);
        // });

          const propertyTypeRow = propertyComponent.element(by.css('[test="propertyType"]'));
          if (propertyTypeRow) {

            propertyTypeRow.element(by.tagName('b')).getText().then(function(propertyType) {
              expect(propertyType.length > 0).toBeTruthy();
            })

            propertyTypeRow.all(by.css('.card-large-text')).then((details) => {
              expect(details.length).toEqual(3);

              expect(propertyTypeRow.element(by.css('.icon-pm-bed'))).toBeDefined();
              expect(propertyTypeRow.element(by.css('.icon-pm-bath'))).toBeDefined();
              expect(propertyTypeRow.element(by.css('.icon-pm-car'))).toBeDefined();
            })
          }


          const companyNameRow = propertyComponent.element(by.css('[test="companyName"]'));
          if (companyNameRow) {
            const companyNameEle = companyNameRow.element(by.tagName('h6'));
            expect(companyNameEle).toBeDefined();
            companyNameEle.getText().then(
              function(text){
                expect(text).toEqual('MyAgent of Member Portal');
              }
            );
          }

          const managerNameRow = propertyComponent.element(by.css('[test="managerName"]'));
          if (managerNameRow) {
            expectRow( managerNameRow, 'b', 'Manager', null);
          }

          const rentRow = propertyComponent.element(by.css('[test="rent"]'));
          if (rentRow) {
            const rent = browser.params.tenancy && browser.params.tenancy.RentAmount ?
              page.formatCurrency(browser.params.tenancy.RentAmount) + ' ' + browser.params.tenancy.RentPeriod : null;

            expectRow( rentRow, 'b', 'Rent', rent );
          }

          const paidToDateRow = propertyComponent.element(by.css('[test="paidToDate"]'));
          if (paidToDateRow) {
            const paidTo = browser.params.tenancy && browser.params.tenancy.PaidTo ?
              page.formatLoalDate(browser.params.tenancy.PaidTo) : null;

            expectRow( paidToDateRow, 'b', 'Paid to date', null);
          }

          const movedInRow = propertyComponent.element(by.css('[test="movedIn"]'));
          if (movedInRow) {
            const tenancyStart = browser.params.tenancy &&  browser.params.tenancy.TenancyStart ?
              page.formatLoalDate(browser.params.tenancy.TenancyStart) : null;

            expectRow( movedInRow, 'b', 'Moved in', tenancyStart);
          }

          const movedOutRow = propertyComponent.element(by.css('[test="movedOut"]'));
          if (movedOutRow) {
            const tenancyEnd = browser.params.tenancy &&  browser.params.tenancy.TenancyEnd ?
              page.formatLoalDate(browser.params.tenancy.TenancyEnd) : null;

            expectRow( movedOutRow, 'b', 'Moved out', tenancyEnd);
          }

          const agreementRow = propertyComponent.element(by.css('[test="agreement"]'));
          if (agreementRow) {
            const agreementStart = browser.params.tenancy &&  browser.params.tenancy.AgreementStart ?
              page.formatLoalDate(browser.params.tenancy.AgreementStart) : null;

            const agreementEnd = browser.params.tenancy &&  browser.params.tenancy.AgreementEnd ?
              page.formatLoalDate(browser.params.tenancy.AgreementEnd) : null;


            const agreement = agreementEnd ? agreementStart + ' to ' + agreementEnd : agreementStart;

            expectRow( agreementRow, 'b', 'Agreement', null);
          }

          const depositeRow = propertyComponent.element(by.css('[test="deposited"]'));
          if (depositeRow) {
              const bondDeposited = browser.params.tenancy && browser.params.tenancy.BondInTrust ?
                page.formatCurrency(browser.params.tenancy.BondInTrust) + ' deposited' : null;

              expectRow( depositeRow, 'b', 'Deposited', null);

          }


          const bondRow = propertyComponent.element(by.css('[test="bond"]'));
          if (bondRow) {
            const bondHeld = browser.params.tenancy && browser.params.tenancy.OpenBondReceived ?
              page.formatCurrency(browser.params.tenancy.OpenBondReceived) + ' held' : null;

            // const bondDeposited = browser.params.tenancy && browser.params.tenancy.BondInTrust ?
            //   page.formatCurrency(browser.params.tenancy.BondInTrust) + ' deposited' : null;
            //
            // const bond = bondDeposited && bondHeld ?  bondDeposited + ', ' + bondHeld : null;

            expectRow( bondRow, 'b', 'Bond held', null);
          }

          const bandReferenceRow = propertyComponent.element(by.css('[test="bankReference"]'));
          if (bandReferenceRow) {
            expectRow( bandReferenceRow, 'b', 'Bank Reference', browser.params.tenancy.BankReference);
          }

          function expectRow(currentRow: any, tagName: string, titleName: string, content: string) {
            const detailElement = currentRow.element(by.tagName(tagName));
            // page.consolelog('test ' + titleName + ' row');
            if (detailElement) {
              detailElement.isPresent().then(function(exists){
                if (exists) {
                  detailElement.getText().then(function(label) {
                    expect(label.trim()).toEqual(titleName);
                  });

                  if (content && content.length > 0) {
                    currentRow.getText().then(function(text) {
                      const fieldValue = text.replace(titleName, '').trim();
                      page.consolelog (titleName + ' row contains text' + fieldValue);
                     // if (content && content.length > 0) {
                        page.consolelog ('expect test text' + content);
                     // }

                      if (content && content.length > 0) {
                        expect(fieldValue).toEqual(content)
                        page.consolelog ('finish test row ' + titleName)
                      }else {
                        expect(fieldValue.length).toBeGreaterThan(0);
                        page.consolelog ('finish test row with content ' + titleName)
                      }
                    });
                  }
                }else {
                  page.consolelog(tagName + ' element not exists in ' + titleName + ' row');
                }

              });
            }
          }

      });

      it ('Property page contains agent card', () => {
        const agentCardComponent = element(by.tagName('app-agent-card'));
        expect(agentCardComponent).toBeDefined();
      });
    });
  }
}

