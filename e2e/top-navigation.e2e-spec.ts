import { browser, element, by } from 'protractor';
import { MemberPortalPage } from './app.po';

export class TopNavigationTestService {
  topNavigationSpecTest() {
    describe('client access top navigation bar', () => {
      let page: MemberPortalPage;

      beforeEach(() => {
        page = new MemberPortalPage();
      });

      it('home page contains top nav bar', () => {
        expect(element(by.tagName('app-navigation'))).toBeDefined();
      });

      it('click logo link access to home page', () => {
        const navComponent = browser.element(by.tagName('app-navigation'));
        const logoComponet =  navComponent.element(by.css('.navbar-brand'));
        logoComponet.click().then(() => {
          browser.getCurrentUrl().then((url) => {
            expect(url).toEqual(page.getBaseUrl() );
          });
        });
      });

      it ('click property filter or link to home page', () => {
        const navComponent = browser.element(by.tagName('app-navigation'));

        const propertyControl = navComponent.element(by.css('.navbar-nav.mr-auto'));

        const propertyFilter = propertyControl.element(by.css('.property-filter'));
        const propertyDisplayLink = propertyControl.element(by.css('[routerLink=""]'));

        if (propertyFilter) {
          expect(propertyFilter).toBeDefined();

          const propertyFilterDropDownMenu = propertyFilter.element(by.css('.dropdown-menu'));

          // propertyFilterDropDownMenu.all(by.tagName('a')).then((menuItems) => {
          //   if (menuItems.length > 1 ) {
          //     // click the second property in property filter
          //     menuItems[1].click().then(() => {
          //       browser.getCurrentUrl().then((url) => {
          //         expect(url).toEqual(page.getBaseUrl() );
          //
          //         propertyDisplayLink = propertyFilter.element(by.css('.nav-link'));
          //
          //         if (propertyDisplayLink) {
          //           propertyDisplayLink.getText().then(function(linkText){
          //             const propertyLinkText = linkText;
          //
          //             const propertyCardComponent = browser.element(by.tagName('app-renting-card'));
          //             const titleControl = propertyCardComponent.element(by.tagName('h6'));
          //             const propertyLinkControl = titleControl.element(by.tagName('a'));
          //
          //             propertyLinkControl.getText().then(function(propertyAddress){
          //               // console.log(propertyAddress);
          //               // console.log(propertyLinkText);
          //               expect(propertyAddress).toContain(propertyLinkText);
          //             })
          //           })
          //         }
          //       });
          //     });
          //   }
          // });
        }else if (propertyDisplayLink) {
          propertyDisplayLink.click().then(() => {
            browser.getCurrentUrl().then((url) => {
              expect(url).toEqual(page.getBaseUrl() );
            })
          });
        }
      });
    });
  }
}


