import { browser, element, by } from 'protractor';
import { MemberPortalPage } from './app.po';

export class HomeTestService {
  homeSpecTest() {
    describe('tenant access', () => {
      let page: MemberPortalPage;
      let originalTimeout;

      beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        page = new MemberPortalPage();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000;
      });

      afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      });

      it('load app-home component', () => {
        expect(element(by.tagName('app-home'))).toBeDefined();
      });

      it('home page contains top nav bar', () => {
        expect(element(by.tagName('app-navigation'))).toBeDefined();
      });

      it('top nav bar contains logo with link', () => {
        const navComponent = browser.element(by.tagName('app-navigation'));
        expect(navComponent).toBeDefined();

        const logoComponet =  navComponent.element(by.css('.navbar-brand'));
        expect(logoComponet).toBeDefined();

        logoComponet.getTagName().then(function(tagName){
          expect(tagName === 'a');
        });

        logoComponet.getAttribute('href').then(function(value){
          expect(value === page.getBaseUrl());
        });
      });

      it('top nav bar contains navitem: property filter: contains more than 1 property', () => {
        const navComponent = browser.element(by.tagName('app-navigation'));
        expect(navComponent).toBeDefined();

        // const propertyControl = navComponent.element(by.css('.property-box'));
        //
        // const propertyFilter = propertyControl.element(by.css('.property-filter'));
        //
        // const containFilter = propertyFilter.isPresent().then(function (exists)
        // {
        //   if (exists) {
        //     const propertyDisplayLink = propertyControl.element(by.css('[routerLink=""]'))
        //
        //     if (propertyFilter) {
        //       expect(propertyFilter).toBeDefined();
        //
        //       const propertyFilterDropDownMenu = propertyFilter.element(by.css('.dropdown-menu'));
        //
        //       propertyFilterDropDownMenu.all(by.tagName('a')).then((menuItems) => {
        //         expect(menuItems.length).toBeGreaterThanOrEqual(1);
        //       });
        //     }else if (propertyDisplayLink) {
        //       expect(propertyDisplayLink).toBeDefined();
        //     }
        //   }
        // });
      });

      it('top nav bar contains navitem: right menu: contains dropdown items', () => {
        const navComponent = browser.element(by.tagName('app-navigation'));
        expect(navComponent).toBeDefined();

        const rightDropdown = navComponent.element(by.css('.float-right.d-none.d-md-block'));

        const avatarButton = rightDropdown.element(by.tagName('button'));
        expect(avatarButton).toBeDefined();

        rightDropdown.all(by.css('.dropdown-item')).then((dropdownItems) => {
          expect(dropdownItems.length).toBeGreaterThanOrEqual(3);
        });

      });

      it('home page contains components', () => {
        expect(element(by.tagName('app-renting-card'))).toBeDefined();
        // expect(element(by.tagName('app-nav-card'))).toBeDefined();
        expect(element(by.tagName('app-common-actions'))).toBeDefined();
        expect(element(by.tagName('app-upcoming-events'))).toBeDefined();
        expect(element(by.tagName('app-activity-feed'))).toBeDefined();
        expect(element(by.tagName('app-agent-card'))).toBeDefined();
      });

      it('home page contains property card', () => {
        const propertyCardComponent = browser.element(by.tagName('app-renting-card'));
        expect(propertyCardComponent).toBeDefined();

        const propertyPhotoControl = propertyCardComponent.element(by.css('.property-photo-control'));
        const propertyMapControl = propertyCardComponent.element(by.css('.agent-logo'));

        // if (propertyPhotoControl) {
        //   const imageControl = propertyPhotoControl.element(by.tagName('img'));
        //   expect(imageControl).toBeDefined();
        // }

        const titleControl = propertyCardComponent.element(by.tagName('h5'));
        const propertyLinkControl = titleControl.element(by.tagName('a'));

        propertyLinkControl.getAttribute('href').then(function(value){
          expect(value === '/member/property');
        });
      });

      // it ('home page contains nav card', () => {
      //   const navCardComponent = browser.element(by.tagName('app-nav-card'));
      //   navCardComponent.all(by.tagName('li')).then((navItems) => {
      //     expect(navItems.length).toBeGreaterThanOrEqual(2);

      //     expect(element(by.cssContainingText('a', 'Transactions')));
      //     expect(element(by.cssContainingText('a', 'Activity')));
      //     expect(element(by.cssContainingText('a', 'Profile')));
      //   });
      // });

      it('home page contains common actions: new maintenance, message agent', () => {
        const commonActions = element(by.tagName('app-common-actions'));
        expect(commonActions).toBeDefined();

        const newMaintenanceComponent = commonActions.element(by.tagName('app-new-maintenance'));
        expect(newMaintenanceComponent);

        const MessageAgentComponent = commonActions.element(by.cssContainingText('button.btn-outline-primary', 'Message Agent'));
        expect(MessageAgentComponent);
      });

      it('home page common actions: add new maintenance', () => {
            const commonActions = element(by.tagName('app-common-actions'));

            const newButton = commonActions.element(by.css('[test="new-maintenance"]'));

            newButton.click().then(
                function() {
                    const maintenanceComponent = element(by.css('[test="maintenance-form"]'));
                    expect(maintenanceComponent).toBeDefined();

                    const modalComponent = element(by.tagName('ngb-modal-window'));
                    expect(modalComponent).toBeDefined();

                    const titleComponent = modalComponent.element(by.tagName('h4'));
                    expect(titleComponent).toBeDefined();

                    titleComponent.getText().then(
                        function(text){
                            page.consolelog(text);
                            expect(text.trim()).toEqual('New Maintenance');
                        }
                    );

                    const summaryElement = modalComponent.element(by.name('Summary'));
                    expect(summaryElement).toBeDefined();
                    summaryElement.clear().then(function() {
                        summaryElement.sendKeys('New Job from ' + browser.params.profile.FirstName);
                    });

                    const descriptionElement = modalComponent.element(by.name('description'));
                    expect(descriptionElement).toBeDefined();
                    descriptionElement.clear().then(function() {
                        descriptionElement.sendKeys('Job Description');
                    });

                    const saveButton = modalComponent.element(by.css('[test="save-maintenance"]'));
                    expect(saveButton).toBeDefined();
                    saveButton.click();
                    browser.waitForAngular();
                    browser.driver.sleep(2000);
                    page.consolelog('click save of new maintenance');
                }
            );
        });

      it('home page common actions: message agent', () => {
          const commonActions = element(by.tagName('app-common-actions'));

          const newButton = commonActions.element(by.css('[test="message-agent"]'));

          newButton.click().then(
              function() {
                  const messageAgentComponent = element(by.css('[test="message-form"]'));
                  expect(messageAgentComponent).toBeDefined();

                  const modalComponent = element(by.tagName('ngb-modal-window'));
                  expect(modalComponent).toBeDefined();

                  const titleComponent = modalComponent.element(by.tagName('h4'));
                  expect(titleComponent).toBeDefined();

                  titleComponent.getText().then(
                      function(text){
                          page.consolelog(text);
                          expect(text.trim()).toEqual('Message Agent');
                      }
                  );

                  const summaryElement = modalComponent.element(by.name('Subject'));
                  expect(summaryElement).toBeDefined();
                  summaryElement.clear().then(function() {
                      summaryElement.sendKeys('New Message from ' + browser.params.profile.FirstName);
                  });

                  const descriptionElement = modalComponent.element(by.name('Body'));
                  expect(descriptionElement).toBeDefined();
                  descriptionElement.clear().then(function() {
                      descriptionElement.sendKeys('Message Body');
                  });

                  const saveButton = modalComponent.element(by.css('[test="save-message"]'));
                  expect(saveButton).toBeDefined();
                  saveButton.click();
                  browser.waitForAngular();
                  browser.driver.sleep(2000);
                  page.consolelog('click save of new message to agent');
              }
          );
      });

      it('home page contains upcoming event card', () => {
        const upComingEventComponent = element(by.tagName('app-upcoming-events'));
        expect(upComingEventComponent).toBeDefined();
      });

      it ('home page upcoming event card contains rent and inspection items', () => {
        const upComingEventComponent = element(by.tagName('app-upcoming-events'));
        upComingEventComponent.all(by.css('.list-item-card')).then((cards) => {

          const userName = browser.params.userName;
          const rent = browser.params.tenancy && browser.params.tenancy.RentAmount ?
            page.formatCurrency(browser.params.tenancy.RentAmount) : null;

          if (userName === 'Tenant1test@propertyme.com') {
            // test user 1: $101/fortnightly, without moved out date, part paid and over due
            // it contains 2 rent and 1 lease and 1 moving out data. could be changed.
            expect(cards.length).toBeGreaterThanOrEqual(4);

            upComingEventComponent.all(by.cssContainingText('app-upcoming-event-rent-due', 'Payment due'))
            .then((rentDueCards) => {
              expect(rentDueCards.length).toBe(3);

              // over due first period amount with partial paid
              // 5 tenants amount is 80.80
              page.testRentActivityCard(rentDueCards[0], '$40.40', true);
              // over due whole periods amount, equal to six times rental amount
              page.testRentActivityCard(rentDueCards[1], '$606.00', true);
              // next due amount, equal to one rental amount
              page.testRentActivityCard(rentDueCards[2], '$101.00', false);
            });

            // const entryInspectionCard = upComingEventComponent.element(
            //   by.cssContainingText('app-upcoming-event-inspection', 'entry inspection')
            // );
            // page.testInspectionCard(entryInspectionCard, 'Upcoming event', 'Initial entry inspection before moving in');
            //
            // const existInspectionCard = upComingEventComponent.element(by.cssContainingText('app-upcoming-event-inspection', 'Final inspection'));
            // page.testInspectionCard(existInspectionCard, 'Upcoming event on', 'Final inspection on moving out');
            //
            // const routineInspectionCard = upComingEventComponent.element(by.cssContainingText('app-upcoming-event-inspection', 'Routine inspection'));
            // page.testInspectionCard(routineInspectionCard, 'Upcoming event on', 'Routine inspection');
          }
          else if (userName === 'Tenant2test@propertyme.com') {
            // test user 2: $102/monthly, with moved out date after 30 days, paid up to move out date
            // it contains 0 rent and 1 lease and 1 moving out and 6 inspeciton data.
            expect(cards.length).toBeGreaterThanOrEqual(8);

            upComingEventComponent.all(by.cssContainingText('app-upcoming-event-rent-due', 'Payment due'))
            .then((rentDueCards) => {
              // paid in full amount
              expect(rentDueCards.length).toBe(0);
            });
          }
          else if (userName === 'Tenant3test@propertyme.com') {
            // test user 3: $103/weekly, without moved out date, part paid, and over due
            // it contains 3 rents.
            expect(cards.length).toBeGreaterThanOrEqual(3);

            upComingEventComponent.all(by.cssContainingText('app-upcoming-event-rent-due', 'Payment due'))
            .then((rentDueCards) => {
              expect(rentDueCards.length).toBe(3);

              // over due first period amount with partial paid
              page.testRentActivityCard(rentDueCards[0], '$61.80', true);
              // over due whole periods amount, equal to 38 times rental amount
              page.testRentActivityCard(rentDueCards[1], '$3,914.00', true);
              // next due amount, equal to one rental amount
              page.testRentActivityCard(rentDueCards[2], '$103.00', false);
            });
          }
          else if (userName === 'Tenant4test@propertyme.com') {
            // test user 4: $104/fortnightly, with moved out date after 30 days, paid in full amount
            // it contains 0 rent and 1 lease end, and 1 moving out.
            expect(cards.length).toBeGreaterThanOrEqual(2);

            upComingEventComponent.all(by.cssContainingText('app-upcoming-event-rent-due', 'Payment due'))
            .then((rentDueCards) => {
              // paid in full amount
              expect(rentDueCards.length).toBe(0);
            });
           }
          else if (userName === 'Tenant5test@propertyme.com') {
             // test user 5: $105/monthly, without moved out date, part paid, and over due
            // it contains 1 rent and 1 lease and 1 moving out data.
            expect(cards.length).toBeGreaterThanOrEqual(3);

            upComingEventComponent.all(by.cssContainingText('app-upcoming-event-rent-due', 'Payment due'))
            .then((rentDueCards) => {
              expect(rentDueCards.length).toBe(3);

              // over due first period amount with partial paid
              page.testRentActivityCard(rentDueCards[0], '$63.00', true);
              // over due whole periods amount, equal to 14 times rental amount
              page.testRentActivityCard(rentDueCards[1], '$1,470.00', true);
              // next due amount, equal to one rental amount
              page.testRentActivityCard(rentDueCards[2], '$105.00', false);
            });
          }

        })
      });

      it ('home page upcoming event card show more', () => {
        // const upComingEventComponent = element(by.tagName('app-upcoming-events'));
        //
        // const showMoreButton = upComingEventComponent.element(by.cssContainingText('button', 'Show More'));
        // const showAllButton = upComingEventComponent.element(by.cssContainingText('button', 'Show All'));
        //
        // showMoreButton.isPresent().then(
        //   function(exists){
        //
        //   });
        //
        // showAllButton.isPresent().then(
        //   function(exists){
        //
        //   });
        //
        // upComingEventComponent.all(by.css('.list-item-card')).count().then(
        //   function(count) {
        //     const userName = browser.params.userName;
        //   }
        // );
      });

      it ('home page contains activity feed card', () => {
        const activityFeedComponent = element(by.tagName('app-activity-feed'));
        expect(activityFeedComponent).toBeDefined();
      });

      it ('home page contains agent card', () => {
        const agentCardComponent = element(by.tagName('app-agent-card'));
        expect(agentCardComponent).toBeDefined();

        const cardHeader = agentCardComponent.element(by.css('.card-header'));
        if (cardHeader) {
          expect(cardHeader).toBeDefined();
        }

        const logoImage = agentCardComponent.element(by.tagName('span.navbar-toggler-icon'));
        if (logoImage) {
          expect(logoImage).toBeDefined();
        }

        const title = agentCardComponent.element(by.css('.card-title'));
        expect(title).toBeDefined();

        const agentContent = agentCardComponent.element(by.css('.list-unstyled.list-spaced'));
        expect(agentContent).toBeDefined();

        agentContent.all(by.tagName('li')).then((contentItems) => {
            // hidden null value agent detail row
          expect(contentItems.length).toBeGreaterThanOrEqual(1);
        });
      });

      it('home page contains footer', () => {
        const aboutLink = element(by.cssContainingText('a', 'About'));
        expect(aboutLink);

        // const helpLink = element(by.cssContainingText('a', 'Help'));
        // expect(helpLink);

        const teamsLink = element(by.cssContainingText('a', 'Terms'));
        expect(teamsLink);
      });
    });
  }
}

