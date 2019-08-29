import { browser, element, by } from 'protractor';
import { MemberPortalPage } from './app.po';

export class SignupTestService {
 signupSpecTest() {
    describe('sign up to PropertyMe', () => {
      let page: MemberPortalPage;
      beforeEach(() => {
        page = new MemberPortalPage();
      })

      it('should signup to PropertyMe', () => {

        let emailToSignup = 'tenant1test@propertyme.com';
        const tenantIndex = browser.params.testTenantIndex;

        page.consolelog('tenant index ' + tenantIndex);

        const contactPerson = browser.params.tenants[tenantIndex].ContactPersons[0];

        browser.params.testTenantIndex += 1;

        emailToSignup = contactPerson.Email;

        page.consolelog('sign up ' + emailToSignup);

        page.consolelog(browser.params.tenants[tenantIndex]);

        browser.params.userName = emailToSignup;

        // setup tenancy
        browser.params.tenancy = browser.params.tenants[tenantIndex].Tenancy;

        page.consolelog('browser params tenancy ' + browser.params.tenancy);

        // setup profile
        browser.params.profile.FirstName = contactPerson.FirstName;
        browser.params.profile.LastName = contactPerson.LastName;
        browser.params.profile.WorkPhone = contactPerson.WorkPhone;
        browser.params.profile.CellPhone = contactPerson.CellPhone;

        page.consolelog('sign up email: ' + browser.params.userName);

        browser.get('sign-in');
       // browser.waitForAngular();
        browser.driver.findElement(by.name('sign_up')).click();
        browser.waitForAngular();


        browser.driver.findElement(by.name('Email')).sendKeys(emailToSignup);

          browser.driver.findElement(by.name('register-button')).click();
          browser.waitForAngular();
          page.consolelog('After signup member');


          // const errorElement = browser.driver.findElement(by.css('.text-danger'));
          //
          // browser.driver.isElementPresent(by.css('.text-danger')).then(function(value){
          //   console.log('find error element ' + value);
          // });


          // console.log('find error element ' + errorElement.isPresent());

          browser.driver.wait(function() {
              return browser.driver.getCurrentUrl().then(function(url) {
                  page.consolelog('the activate url is' + url);
                  return url.indexOf('activate') >= 0;
              });
          }, 9000);


          // activate member
          page.consolelog('Activate member');

          const testPassword : string = browser.params.tenantPassword;
          browser.params.password = testPassword;
          page.consolelog(browser.params.password);
          browser.driver.findElement(by.name('WorkPhone')).sendKeys(browser.params.profile.WorkPhone);
          browser.driver.findElement(by.name('MobilePhone')).sendKeys(browser.params.profile.CellPhone);
          browser.driver.findElement(by.name('Password')).sendKeys(testPassword);
          browser.driver.findElement(by.name('confirmPassword')).sendKeys(testPassword);

          const readCheckbox = browser.driver.findElement(by.css('[test="read-terms"]'));
          if (readCheckbox != null) {
              readCheckbox.click();
              browser.waitForAngular();
              browser.driver.sleep(500);
          }


          browser.driver.findElement(by.css('[type="submit"]')).click();
          browser.waitForAngular();
          page.consolelog('click submit');

          expect(element(by.name('"sign-in"'))).toBeDefined();

      });
    })
 }
}




