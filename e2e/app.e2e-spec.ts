import { browser, element, by } from 'protractor';
import { MemberPortalPage } from './app.po';

describe('member portal', () => {
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

  it('should signed in', () => {
    const userName =  'kundai0@gmail.com';
    const password =  'Password123';

    page.consolelog('user name: ' + userName);
    page.consolelog('password: ' + password);

    browser.get('sign-in');
    browser.driver.findElement(by.name('username')).sendKeys(userName);
    browser.driver.findElement(by.name('password')).sendKeys(password);
    browser.driver.findElement(by.css('[type="submit"]')).click();
    browser.waitForAngular();

    page.consolelog('click submit');
  });

  it ('filter different property', () => {
    page.changePropertyByFilter('99 Pitt St');
  });

  it('access activity page', () => {
    page.accessPageByNavCard('Activity');
  });

  it ('test show more', () => {
    const upComingEventComponent = element(by.tagName('app-upcoming-events'));

    const showMoreButton = upComingEventComponent.element(by.cssContainingText('button', 'Show More'));
    const showAllButton = upComingEventComponent.element(by.cssContainingText('button', 'Show All'));

    showMoreButton.isPresent().then(
      function(exists){

      });

    showAllButton.isPresent().then(
      function(exists){

      });

    upComingEventComponent.all(by.css('.list-item-card')).count().then(
      function(count) {
        const userName = browser.params.userName;
      }
    );
  });


});
