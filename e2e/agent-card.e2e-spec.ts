import { browser, element, by } from 'protractor';
import { MemberPortalPage } from './app.po';

export class AgentCardTestService {
  agentCardSpecTest() {
    describe('tenant agent card', () => {
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


      it ('Agent card exists', () => {
        const agentCardComponent = element(by.tagName('app-agent-card'));
        expect(agentCardComponent).toBeDefined();
      });

      it ('Agent card contains header', () => {
        const agentCardComponent = element(by.tagName('app-agent-card'));

        const headerElement = agentCardComponent.element(by.css('.card-header'));

        expect(headerElement).toBeDefined();
        // headerElement.isPresent().then(function(exists) {
        //     if (exists) {
        //       expect(headerElement.element(by.tagName('img'))).toBeDefined();
        //     }
        //   }
        // )
      });

      it ('Agent card contains avatar logo', () => {
        const agentCardComponent = element(by.tagName('app-agent-card'));

        const avatarElement = agentCardComponent.element(by.css('.rounded-circle'));

        expect(avatarElement);
      });

      it ('Agent card contains title', () => {
        const agentCardComponent = element(by.tagName('app-agent-card'));
        const contentElement = agentCardComponent.element(by.css('.text-center'));

        // manager name exists
        expect(contentElement.element(by.tagName('h6'))).toBeDefined();

        expect(contentElement.element(by.css('.card-title.card-name'))).toBeDefined();

      });

      it ('Agent card contains detail', () => {
        const agentCardComponent = element(by.tagName('app-agent-card'));
        const bodyElement = agentCardComponent.element(by.css('.card-body'));

        bodyElement.all(by.tagName('li')).then((items) => {
            // hidden null value agent detail row
          expect(items.length).toBeGreaterThanOrEqual(1);

          expect(bodyElement.element(by.css('.icon-phone'))).toBeDefined();
          expect(bodyElement.element(by.css('.icon-mobile'))).toBeDefined();
          expect(bodyElement.element(by.css('.icon-email'))).toBeDefined();
          expect(bodyElement.element(by.css('.icon-link'))).toBeDefined();
          expect(bodyElement.element(by.css('.icon-location-pin'))).toBeDefined();
        });
      });

    });
  }
}


