import { browser, element, by } from 'protractor';
import { MemberPortalPage } from './app.po';

describe('prepare portal test data', () => {
  it('should have test portfolio data set ready', () => {
    let originalTimeout;
    let page: MemberPortalPage;

    beforeEach(() => {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
      page = new MemberPortalPage();
    });

    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    const mainAppUrl = browser.params && browser.params.mainAppUrl ? browser.params.mainAppUrl : '';
    const noOfTenants = browser.params.noOfTenants;
    const prepareUrl = mainAppUrl + 'api/billing/prepare-test-portfolio-for-portal?Tenants=' + noOfTenants + '&format=json';
    console.log('Prepare portfolio on main url: ' + prepareUrl);

    browser.driver.get(prepareUrl).then(function(){
      browser.driver.wait(function() {
        return browser.driver.findElement(by.tagName('body')).then(function(el) {
          return el.getText();
        }).then(function(textStr){
          const done = textStr.indexOf('IsSuccessful') >= 0;
          console.log('is Successful: ' + done);
          if (done) {
            const preparedData = JSON.parse(textStr);
            // console.log('total test tenants: ' + preparedData.Tenants.length);
            if (preparedData && preparedData.Tenants) {
                browser.params.tenants = preparedData.Tenants;
                browser.params.settings = preparedData.Settings;
                browser.params.lots = preparedData.Lots;
                if (browser.params.tenants) {
                    console.log(browser.params.tenants.length);
                }
            }
          }
          return done;
        });
      }, 600000);
    });


  });
});
