import { browser, element, by } from 'protractor';
import { MemberPortalPage } from './app.po';

export class ProfileTestService {
  profileSpecTest() {
    describe('member profile page', () => {
      let page: MemberPortalPage;
      let originalTimeout;
      beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        page = new MemberPortalPage();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 180000;
      });

      afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
      });


      it ('Access profile page', () => {
        page.accessPageByNavMenu('Profile');
        // page.accessPageByNavCard('Profile');
      });

      it ('profile page contains action buttons', () => {
        expect(element(by.cssContainingText('button', 'Change password'))).toBeDefined();
        // expect(element(by.cssContainingText('button', 'Change email'))).toBeDefined();
        expect(element(by.cssContainingText('button', 'Edit'))).toBeDefined();
      });

      it ('profile page contains details', () => {

        const profileComponent = element(by.css('[test="member-profile"]'));


        const memberprofilecontact = profileComponent.element(by.css('[role="member-profile-contact"]'));

        const memberprofiletenancy = profileComponent.element(by.css('[role="member-profile-tenancy"]'));

        const memberprofileregistered = profileComponent.element(by.css('[role="member-profile-registered"]'));

        // member profile contact
        if (memberprofilecontact) {
          expect(memberprofilecontact.element(by.tagName('img'))).toBeDefined();
          const nameElement = memberprofilecontact.element(by.tagName('h6'));
          expect(nameElement).toBeDefined();
          nameElement.getText().then(
            function(text){
              expect(text.trim()).toEqual(browser.params.profile.FirstName + ' ' + browser.params.profile.LastName);
            }
          );
          const companyElement = memberprofilecontact.element(by.css('[role="company-name"]'));
          expect(companyElement).toBeDefined();
          companyElement.getText().then(
            function(text){
              expect(text.trim()).toEqual(browser.params.profile.CompanyName);
            }
          );

          const mobilePhoneElement = memberprofilecontact.element(by.css('[role="mobile-phone"]'));
          expect(mobilePhoneElement).toBeDefined();
          mobilePhoneElement.getText().then(
            function(text){
              expect(text.trim()).toEqual('Mobile phone ' + browser.params.profile.CellPhone);
            }
          );
          const workPhoneElement = memberprofilecontact.element(by.css('[role="work-phone"]'));
          expect(workPhoneElement).toBeDefined();
          workPhoneElement.getText().then(
            function(text){
              expect(text.trim()).toEqual('Work phone ' + browser.params.profile.WorkPhone)
            }
          );

          const emailElement = memberprofilecontact.element(by.css('[role="email"]'));
          expect(emailElement).toBeDefined();
          emailElement.getText().then(
            function(text){
              expect(text.trim()).toEqual('Email ' + browser.params.userName.toLowerCase())
            }
          );
        }

        // member profile tenancy
        if (memberprofiletenancy) {
          expect(memberprofiletenancy.element(by.tagName('h5'))).toBeDefined();

          const tenancyList = memberprofiletenancy.element(by.css('[role="member-profile-tenancy-list"]'));

          expect(tenancyList).toBeDefined();

          tenancyList.all(by.css('.tenancy-link')).then((tenancies) => {
            expect(tenancies.length).toEqual(1);
          });
        }

        // member profile registered
        if (memberprofileregistered) {
          expect(memberprofileregistered.element(by.tagName('h5'))).toBeDefined();
          expect(memberprofileregistered.element(by.css('.icon-mobile'))).toBeDefined();
          expect(memberprofileregistered.element(by.css('.icon-email'))).toBeDefined();
          expect(memberprofileregistered.element(by.css('.icon-location-pin'))).toBeDefined();
        }

      });

      it ('Edit Profile', () => {
        const editButton = element(by.cssContainingText('button', 'Edit'));

        editButton.click().then(
          function() {
            const now: Date = new Date();
            const  timestamp = Math.round(now.getTime() / 1000); // 1405792937

            const editComponent = element(by.tagName('app-edit'));
            expect(editComponent).toBeDefined();

            const titleComponent = editComponent.element(by.tagName('h4'));
            expect(titleComponent).toBeDefined();

            titleComponent.getText().then(
              function(text){
                expect(text.trim()).toEqual('Edit Profile');
              }
            );

            const firstNameElement = editComponent.element(by.name('FirstName'));
            expect(titleComponent).toBeDefined();
            firstNameElement.clear().then(function() {
              browser.params.profile.FirstName = 'Tenant 1' + timestamp;
              firstNameElement.sendKeys(browser.params.profile.FirstName);
            });

            const lastNameElement = editComponent.element(by.name('LastName'));
            expect(titleComponent).toBeDefined();
            lastNameElement.clear().then(function() {
              browser.params.profile.LastName = 'Test' + timestamp;
              lastNameElement.sendKeys(browser.params.profile.LastName);
            });

            const mobilePhoneElement = editComponent.element(by.name('MobilePhone'));
            expect(titleComponent).toBeDefined();
            mobilePhoneElement.clear().then(function() {
              browser.params.profile.CellPhone = '0411223344';
              mobilePhoneElement.sendKeys(browser.params.profile.CellPhone);
            });


            const workPhoneElement = editComponent.element(by.name('WorkPhone'));
            expect(titleComponent).toBeDefined();
            workPhoneElement.clear().then(function() {
              browser.params.profile.WorkPhone = '98765432';
              workPhoneElement.sendKeys(browser.params.profile.WorkPhone);
            });


            const saveButton = editComponent.element(by.css('[type="submit"]'));
            expect(saveButton).toBeDefined();
            saveButton.click();
            browser.waitForAngular();
            browser.driver.sleep(2000);
            page.consolelog('click save of edit');

            browser.waitForAngular();
            browser.waitForAngular();
            // browser.driver.wait(function() {
              const profileComponent = element(by.css('[test="member-profile"]'));


              const memberprofilecontact = profileComponent.element(by.css('[role="member-profile-contact"]'));

              if (memberprofilecontact) {
                const nameElement = memberprofilecontact.element(by.tagName('h6'));
                expect(nameElement).toBeDefined();
                nameElement.getText().then(
                  function(text){
                    page.consolelog('currrent member name ' + text.trim());

                    expect(text.trim()).toEqual(browser.params.profile.FirstName + ' ' + browser.params.profile.LastName )
                  }
                );
                const companyElement = memberprofilecontact.element(by.css('[role="company-name"]'));
                expect(companyElement).toBeDefined();
                companyElement.getText().then(
                  function(text){
                    expect(text.trim()).toEqual(browser.params.profile.CompanyName )
                  }
                );

                const mobilePhoneEle = memberprofilecontact.element(by.css('[role="mobile-phone"]'));
                expect(mobilePhoneEle).toBeDefined();
                mobilePhoneEle.getText().then(
                  function(text){
                    expect(text.trim()).toEqual('Mobile phone ' + browser.params.profile.CellPhone)
                  }
                );
                const workPhoneEle = memberprofilecontact.element(by.css('[role="work-phone"]'));
                expect(workPhoneEle).toBeDefined();
                workPhoneEle.getText().then(
                  function(text){
                    expect(text.trim()).toEqual('Work phone ' + browser.params.profile.WorkPhone)
                  }
                );
              }
             //}, 5000);
          }
        );
      });

      it ('Change Password', () => {
        const changePasswordButton = element(by.cssContainingText('button', 'Change password'));

        changePasswordButton.click().then(
          function() {
            const changePasswordComponent = element(by.tagName('app-change-password-dialog'));

            expect(changePasswordComponent).toBeDefined();

            const titleComponent = changePasswordComponent.element(by.tagName('h4'));
            expect(titleComponent).toBeDefined();

            titleComponent.getText().then(
              function(text){
                expect(text.trim()).toEqual('Change Password');
              }
            );

            const currentPasswordElement = changePasswordComponent.element(by.name('CurrentPassword'));
            expect(currentPasswordElement).toBeDefined();
            const currentPassword = browser.params.password;
            currentPasswordElement.sendKeys(currentPassword);

            if (currentPassword === '1111111111') {
              browser.params.password = '2222222222';
            }else {
              browser.params.password = '1111111111';
            }

            const newPasswordElement = changePasswordComponent.element(by.name('NewPassword'));
            expect(newPasswordElement).toBeDefined();
            newPasswordElement.sendKeys(browser.params.password);

            const confirmPasswordElement = changePasswordComponent.element(by.name('ConfirmPassword'));
            expect(confirmPasswordElement).toBeDefined();
            confirmPasswordElement.sendKeys(browser.params.password);

            const saveButton = changePasswordComponent.element(by.css('[type="submit"]'));
            expect(saveButton).toBeDefined();
            saveButton.click();
            browser.waitForAngular();

            page.consolelog('click save of change password');

            browser.get('sign-in');

            browser.driver.findElement(by.name('username')).sendKeys(browser.params.userName);
            browser.driver.findElement(by.name('password')).sendKeys(browser.params.password);
            browser.driver.findElement(by.css('[type="submit"]')).click();
            browser.waitForAngular();

            console.log('click submit');
          }
        );
      });
    });
  }
}



