import { browser, element, by } from 'protractor';
import { MemberPortalPage } from './app.po';

export class ActivityTestService {
  activitySpecTest() {
    describe('tenant activity page', () => {
      let page: MemberPortalPage;
      let originalTimeout;

      beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        page = new MemberPortalPage();
      });

      afterEach(function() {
      });

      it('access activity page', () => {
        page.accessPageByNavCard('Activity');
      });


      it ('activity page contains components', () => {
        expect(element(by.tagName('app-renting-card'))).toBeDefined();
        // expect(element(by.tagName('app-nav-card'))).toBeDefined();
        expect(element(by.tagName('app-common-actions'))).toBeDefined();
      });

      it ('activity page contains current activity', () => {

        const currentActivitiesElement = element(by.css('[role="currentActivities"]'));

        currentActivitiesElement.isPresent().then(function(exists){
          if (exists) {
            const titleElement = currentActivitiesElement.element(by.tagName('h5'));
            expect(titleElement).toBeDefined();

            titleElement.getText().then(
              function(text){
                expect(text.trim()).toEqual('Current Activity');
              }
            );

            currentActivitiesElement.all(by.css('.list-item-card')).then((cards) => {
              const userName = browser.params.userName;
              if (userName === 'Tenant1test@propertyme.com') {
                // todo, test user 1  6 inspeciton data. could be changed.
                expect(cards.length).toBeGreaterThanOrEqual(6);

                // const reportedJobCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-job', 'Reported'));
                // page.testJobActivityCard(reportedJobCard, 'reported');
                //
                // const approvedJobCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-job', 'Approved'));
                // page.testJobActivityCard(approvedJobCard, 'approved');
                //
                // const assignedJobCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-job', 'Assigned'));
                // page.testJobActivityCard(assignedJobCard, 'assigned');

                const entryInspectionCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-inspection', 'entry inspection'));
                page.testInspectionCard(entryInspectionCard, 'Property inspect', 'Initial entry inspection before moving in');

                const existInspectionCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-inspection', 'Final inspection'));
                page.testInspectionCard(existInspectionCard, 'Property inspect', 'Final inspection on moving out');

                const routineInspectionCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-inspection', 'Routine inspection'));
                page.testInspectionCard(routineInspectionCard, 'Property inspect', 'Routine inspection');
              } else if (userName === 'Tenant2test@propertyme.com') {
                // todo, test user 2 contains 3 job and 9 inspeciton data. could be changed.
                expect(cards.length).toBeGreaterThanOrEqual(12);

                const reportedJobCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-job', 'Reported'));
                page.testJobActivityCard(reportedJobCard, 'reported');

                const assignedJobCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-job', 'Assigned'));
                page.testJobActivityCard(assignedJobCard, 'assigned');

                const approvedJobCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-job', 'Approved'));
                page.testJobActivityCard(approvedJobCard, 'assigning to tradesperson');

                const entryInspectionCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-inspection', 'entry inspection'));
                page.testInspectionCard(entryInspectionCard, 'Property inspect', 'Initial entry inspection before moving in');

                const existInspectionCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-inspection', 'Final inspection'));
                page.testInspectionCard(existInspectionCard, 'Property inspect', 'Final inspection on moving out');

                const routineInspectionCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-inspection', 'Routine inspection'));
                page.testInspectionCard(routineInspectionCard, 'Property inspect', 'Routine inspection');
              }
              else if (userName === 'Tenant3test@propertyme.com') {
                // todo, test user 3 contains 3 job and 9 inspeciton data. could be changed.
                expect(cards.length).toBeGreaterThanOrEqual(12);

                const assignedJobCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-job', 'Assigned'));
                page.testJobActivityCard(assignedJobCard, 'assigned');

                const entryInspectionCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-inspection', 'entry inspection'));
                page.testInspectionCard(entryInspectionCard, 'Property inspect', 'Initial entry inspection before moving in');

                const existInspectionCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-inspection', 'Final inspection'));
                page.testInspectionCard(existInspectionCard, 'Property inspect', 'Final inspection on moving out');

                const routineInspectionCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-inspection', 'Routine inspection'));
                page.testInspectionCard(routineInspectionCard, 'Property inspect', 'Routine inspection');
              }
              else if (userName === 'Tenant4test@propertyme.com') {
                // todo, test user 4 contains 2 job and 9 inspeciton data. could be changed.
                expect(cards.length).toBeGreaterThanOrEqual(11);

                const assignedJobCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-job', 'Assigned'));
                page.testJobActivityCard(assignedJobCard, 'assigned');

                const entryInspectionCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-inspection', 'entry inspection'));
                page.testInspectionCard(entryInspectionCard, 'Property inspect', 'Initial entry inspection before moving in');

                const existInspectionCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-inspection', 'Final inspection'));
                page.testInspectionCard(existInspectionCard, 'Property inspect', 'Final inspection on moving out');

                const routineInspectionCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-inspection', 'Routine inspection'));
                page.testInspectionCard(routineInspectionCard, 'Property inspect', 'Routine inspection');
              }
              else if (userName === 'Tenant5test@propertyme.com') {
                // todo, test user 5 contains 1 job and 6 inspeciton data. could be changed.
                expect(cards.length).toBeGreaterThanOrEqual(7);

                const assignedJobCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-job', 'Assigned'));
                page.testJobActivityCard(assignedJobCard, 'assigned');

                const entryInspectionCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-inspection', 'entry inspection'));
                page.testInspectionCard(entryInspectionCard, 'Property inspect', 'Initial entry inspection before moving in');

                const existInspectionCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-inspection', 'Final inspection'));
                page.testInspectionCard(existInspectionCard, 'Property inspect', 'Final inspection on moving out');

                const routineInspectionCard = currentActivitiesElement.element(by.cssContainingText('app-activity-feed-inspection', 'Routine inspection'));
                page.testInspectionCard(routineInspectionCard, 'Property inspect', 'Routine inspection');
              }
            });

          }
        });
      });

      it ('activity page contains completed activity', () => {

        const completedActivitiesElement = element(by.css('[role="completedActivities"]'));

        completedActivitiesElement.isPresent().then(function(exists) {
          if (exists) {
            const titleElement = completedActivitiesElement.element(by.tagName('h5'));
            expect(titleElement).toBeDefined();

            titleElement.getText().then(
              function(text){
                expect(text.trim()).toEqual('Completed Activity');
              }
            );

            completedActivitiesElement.all(by.css('.list-item-card')).then((cards) => {
              const userName = browser.params.userName;
              if (userName === 'Tenant1test@propertyme.com') {
                // todo, test user 1  10 inspeciton data. could be changed.
                expect(cards.length).toBeGreaterThanOrEqual(10);

                // const closeJobCard = completedActivitiesElement.element(by.cssContainingText('app-activity-feed-job', 'Closed'));
                // page.testJobActivityCard(closeJobCard, 'completed');

                // const entryInspectionCard = completedActivitiesElement.element(by.cssContainingText('app-activity-feed-inspection', 'entry inspection'));
                // page.testInspectionCard(entryInspectionCard, 'Property inspect', 'Initial entry inspection before moving in');
                //
                // const existInspectionCard = completedActivitiesElement.element(by.cssContainingText('app-activity-feed-inspection', 'Final inspection'));
                // page.testInspectionCard(existInspectionCard, 'Property inspect', 'Final inspection on moving out');
                //
                // const routineInspectionCard = completedActivitiesElement.element(by.cssContainingText('app-activity-feed-inspection', 'Routine inspection'));
                // page.testInspectionCard(routineInspectionCard, 'Property inspect', 'Routine inspection');
              }
              else if (userName === 'Tenant2test@propertyme.com') {
                // todo, test user 2 contains 0 data. could be changed.
                expect(cards.length).toBeGreaterThanOrEqual(0);

                // const closeJobCard = completedActivitiesElement.element(by.cssContainingText('app-activity-feed-job', 'Closed'));
                // page.testJobActivityCard(closeJobCard, 'completed');
              }
              else if (userName === 'Tenant3test@propertyme.com') {
                // todo, test user 3 contains 10 job data. could be changed.
                expect(cards.length).toBeGreaterThanOrEqual(10);
              }
              else if (userName === 'Tenant4test@propertyme.com') {
                // todo, test user 4 contains 10 job data. could be changed.
                expect(cards.length).toBeGreaterThanOrEqual(10);
              }
              else if (userName === 'Tenant5test@propertyme.com') {
                // todo, test user 5 contains 10 job data. could be changed.
                expect(cards.length).toBeGreaterThanOrEqual(10);
              }
            });
          }
        });


      });

    });
  }
}


