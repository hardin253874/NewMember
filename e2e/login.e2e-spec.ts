import { browser, element, by } from 'protractor';
import { MemberPortalPage } from './app.po';

export class LoginTestService {
  loginSpecTest() {
    describe('tenant access', () => {
      let page: MemberPortalPage;
      beforeEach(() => {
        page = new MemberPortalPage();
      })

      it('should signed in', () => {
        const userName = browser.params && browser.params.userName ? browser.params.userName : 'dev@propertyme.com';
        const password = browser.params && browser.params.password ? browser.params.password : 'es3mb9kwk0';

        page.consolelog('user name: ' + userName);
        page.consolelog('password: ' + password);

        browser.get('sign-in');
        browser.driver.findElement(by.name('username')).sendKeys(userName);
        browser.driver.findElement(by.name('password')).sendKeys(password);
        browser.driver.findElement(by.css('[type="submit"]')).click();

        browser.waitForAngular();

        page.consolelog('click submit');
      });

    });
  }
}

