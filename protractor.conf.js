// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
/*global jasmine */
const { SpecReporter } = require('jasmine-spec-reporter');


var q = require('q');

exports.config = {
  allScriptsTimeout: 90000,
  specs: [
    //  './e2e/prepare-test-data.e2e-spec.ts'
    //  ,'./e2e/signup.e2e-spec.ts',
    // './e2e/login.e2e-spec.ts',
    //'./e2e/home.e2e-spec.ts',
    //'./e2e/top-navigation.e2e-spec.ts',
    //'./e2e/agent-card.e2e-spec.ts',
    //'./e2e/transaction.e2e-spec.ts',
   // './e2e/activity-page.e2e-spec.ts',
    // './e2e/property-page.e2e-spec.ts',
   // './e2e/profile.e2e-spec.ts'

  ],
  suites: {
    prepare: './e2e/prepare-test-data.e2e-spec.ts',
    tenant1 : [
      './e2e/tenant1.suite.ts'
    ],
    tenant2 : [
      './e2e/tenant2.suite.ts'
    ],
    tenant3 : [
      './e2e/tenant3.suite.ts'
    ],
    tenant4 : [
      './e2e/tenant4.suite.ts'
    ],
    tenant5 : [
      './e2e/tenant5.suite.ts'
    ],
    smoketest: './e2e/smoke-test.e2e-spec.ts'
  },
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  params:{
    adminUsername : 'dev@propertyme.com',
    adminPassword: 'es3mb9kwk0',
    userName: 'Tenant1test@propertyme.com',//
    password: '1111111111', //
    mainAppUrl: 'http://localhost:8080/',
    noOfTenants: 2,
    testTenants: [],
    testTenantIndex: 0,
    tenantPassword: '1111111111',
    profile: {
      FirstName: 'Tenant 1',
      LastName: 'Test',
      CompanyName: '',
      WorkPhone: '0201020304',
      CellPhone: '0401020304'
    },
    tenancy: {},
    tenants: null,
    settings: null,
    lots: null,
    debugMode: true
  },
  //framework: 'jasmine2',
  frameworks: ['jasmine2', '@angular/cli'],
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 100000,
    print: function() {}
  },
  beforeLaunch: function() {
    require('ts-node').register({
      project: 'e2e'
    });
  },
  onPrepare() {
    console.log('base url: ' + browser.baseUrl);
    console.log('mainAppUrl: ' + browser.params.mainAppUrl);
    console.log('admin Username: ' + browser.params.adminUsername);
    console.log('admin password: ' + browser.params.adminPassword);
    jasmine.getEnv().addReporter(
      new SpecReporter({ spec: { displayStacktrace: true } }));

    const jasmineReporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(
      new jasmineReporters.JUnitXmlReporter({
        consolidateAll: true,
        savePath: 'test-reports',
        filePrefix: 'junit-report-e2e'
      }));


    const  HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
    const reporter = new HtmlScreenshotReporter({
      dest: 'test-reports/screenshots',
      filename: 'test-report.html',
      reportOnlyFailedSpecs: false,
      captureOnlyFailedSpecs: true,
      ignoreSkippedSpecs: true
    });

    jasmine.getEnv().addReporter(reporter);


      // implicit and page load timeouts
      browser.manage().timeouts().pageLoadTimeout(100000);
      browser.manage().timeouts().implicitlyWait(90000);

    // var defer = protractor.promise.defer();

    // console.log('Prepare portfolio on main url: ' + browser.params.mainAppUrl);
    // browser.get(browser.params.mainAppUrl);

    // return browser.executeAsyncScript(function() {
    //   var callback = arguments[arguments.length - 1];
    //   var xhr = new XMLHttpRequest();
    //   xhr.open("GET", "api/billing/prepare-test-portfolio-for-portal", true);
    //   xhr.onreadystatechange = function() {
    //     if (xhr.readyState == 4) {
    //       let response = JSON.parse(xhr.responseText);
    //       console.log(response);
    //       browser.params.testTenants = response.Tenants;
    //       callback(response);
    //     }
    //   }
    //   xhr.send('');
    // }).then( function(response) {
    //   defer.fulfill(response)
    // });

    // return defer.promise;


      //login page
    //   browser.ignoreSynchronization = true;
    //
    //   let userName = browser.params && browser.params.userName ? browser.params.userName : 'dev@propertyme.com';
    //   let password = browser.params && browser.params.password ? browser.params.password : 'es3mb9kwk0';
    //
    //   browser.get('sign-in');
    //   browser.driver.findElement(by.name('username')).sendKeys(userName);
    //   browser.driver.findElement(by.name('password')).sendKeys(password);
    //   browser.driver.findElement(by.css('[type="submit"]')).click();
    //   browser.waitForAngular();
    //
    //   console.log('click submit');

    // return browser.driver.wait(function() {
    //     return browser.driver.getCurrentUrl().then(function(url) {
    //       console.log('after login url: ' + url);
    //       return false;
    //     });
    //   }, 10000);
  }
};
