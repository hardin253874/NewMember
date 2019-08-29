import { browser, element, by } from 'protractor';
import { MemberPortalPage } from './app.po';

describe('tenant renting card', () => {
  let page: MemberPortalPage;

  beforeEach(() => {
    page = new MemberPortalPage();
    browser.get('home');
    browser.waitForAngular();
  });

  it('should navigate to home', () => {

    // browser.getCurrentUrl().then((url) => {
    //   console.log('current url: ' + url);
    //   expect(url).toEqual(page.getBaseUrl());
    // });
  });

  it('should contains agent card widget', () => {
    expect(element(by.tagName('app-agent-card'))).toBeDefined();
  });

  // it('should contains agent card block', () => {
  //   // expect contain more than 0 renting card block
  //   element.all(by.css('.renting-card-gap')).then((elements) => {
  //     expect(elements.length).toBeGreaterThan(0);
  //   })
  // });
  //
  // it('should first renting card block works', () => {
  //
  //   let firstRentingCardBlock;
  //
  //   element.all(by.css('.renting-card-gap')).then((elements) => {
  //     firstRentingCardBlock = elements[0];
  //
  //     expect(firstRentingCardBlock).toBeDefined();
  //
  //     expect(firstRentingCardBlock.element(by.tagName('h6'))).toBeDefined();
  //
  //     expect(firstRentingCardBlock.element(by.tagName('h6')).getText()).toEqual('Renting');
  //
  //     const titleElement = firstRentingCardBlock.element(by.css('.renting-card-link'));
  //
  //     expect(titleElement).toBeDefined();
  //
  //     const ulElement = firstRentingCardBlock.element(by.tagName('ul'));
  //
  //     expect(ulElement).toBeDefined();
  //
  //     expect(ulElement.element(by.css('[role="address"]'))).toBeDefined();
  //
  //     expect(ulElement.element(by.css('[role="paidto"]'))).toBeDefined();
  //
  //     expect(ulElement.element(by.css('[role="partpaid"]'))).toBeDefined();
  //
  //     expect(ulElement.element(by.css('[role="companyname"]'))).toBeDefined();
  //   })
  // });
  //
  // it ('should first renting card block new maintenance button works', () => {
  //   element.all(by.css('.renting-card-gap')).then((elements) => {
  //     const firstRentingCardBlock = elements[0];
  //
  //     expect(firstRentingCardBlock).toBeDefined();
  //
  //     const newMaintenanceElement = firstRentingCardBlock.element(by.tagName('app-new-maintenance'));
  //
  //     expect(newMaintenanceElement);
  //
  //     newMaintenanceElement.click().then(
  //       function(){
  //         const modalElement = element(by.tagName('ngb-modal-window'));
  //
  //         expect(modalElement).toBeDefined();
  //
  //         const modalTitle = modalElement.element(by.css('.modal-title'));
  //
  //         expect(modalTitle).toBeDefined();
  //
  //         modalTitle.getText().then(
  //           function(text){
  //             expect(text).toEqual('New Maintenance');
  //           }
  //         );
  //
  //         const cancelButton = modalElement.element(by.cssContainingText('button', 'Cancel'));
  //
  //         expect(cancelButton).toBeDefined();
  //
  //         cancelButton.click();
  //       }
  //     );
  //   })
  // });
  //
  // it ('should first renting card block property link works', () => {
  //   element.all(by.css('.renting-card-gap')).then((elements) => {
  //     const firstRentingCardBlock = elements[0];
  //
  //     expect(firstRentingCardBlock).toBeDefined();
  //
  //     const titleElement = firstRentingCardBlock.element(by.css('.renting-card-link'));
  //
  //     expect(titleElement).toBeDefined();
  //
  //     titleElement.click().then(
  //       function() {
  //         browser.getCurrentUrl().then((url) => {
  //            expect(url).toContain(page.getBaseUrl() + 'property');
  //         });
  //       }
  //     );
  //   })
  // });

});
