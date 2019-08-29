import { browser, element, by } from 'protractor';
import { DatePipe, CurrencyPipe } from '@angular/common';

export class MemberPortalPage {
  getBaseUrl() {
    let baseUrl = browser.baseUrl ? browser.baseUrl : 'http://portal.lvh.me:4200/';
    if (!baseUrl.endsWith('/')) {
      baseUrl = baseUrl + '/';
    }
    return baseUrl;
  }


  navigateTo(routePath) {
    const path = routePath ? this.getBaseUrl() + routePath : this.getBaseUrl();
    return browser.get(path);
  }

  navigateToSignIn() {
    return browser.get('/sign-in');
  }

  navigateToSignInWithMoreTimeout(timeout) {
        return browser.get('/sign-in', timeout);
  }

  getSignInButton() {
    element(by.css('.app-login-form .btn.btn-primary')).getText().then((text: any) => console.log("Check: " + text));
    return element(by.css('.app-login-form .btn.btn-primary')).getText();

  }

  accessPage(pageName: string) {
    const navComponent = browser.element(by.tagName('app-navigation'));
    const logoComponet =  navComponent.element(by.css('.navbar-brand'));
    logoComponet.click().then(() => {
      browser.getCurrentUrl().then((url) => {
        this.accessPageByNavCard(pageName);
      });
    });
  }

  accessPageByNavCard(pageName: string) {
    const navigationComponent = browser.element(by.tagName('app-navigation'));
    const dropdownComponet =  navigationComponent.element(by.css('.d-md-block .dropdown-toggle'));

    dropdownComponet.click().then(() => {
      const dropdownMenuComponet =  navigationComponent.element(by.css('.dropdown-menu.show'));
      const linkElement = dropdownMenuComponet.element(by.cssContainingText('a', pageName));
          linkElement.click();
    });
  }

  accessPageByNavMenu(pageName: string) {
    const navComponent = browser.element(by.tagName('app-navigation'));
    const showArea = navComponent.element(by.css('.float-right.d-none.d-md-block'));
    const menuelement = showArea.element(by.css('.navbar-btn'));

    menuelement.click().then(() => {
      const pageLink = showArea.element(by.cssContainingText('a', pageName));
      pageLink.click();
    });
  }

  changePropertyByFilter(propertyName: string) {
    const navComponent = browser.element(by.tagName('app-navigation'));
    const filterElement = navComponent.element(by.css('.nav-item.property-filter'));

    filterElement.isPresent().then(function(exists){
      if (exists) {
        const propertyLink = filterElement.element(by.cssContainingText('a', propertyName));

        propertyLink.click();
      }
    });
  }

  signIn(userName, password) {
    if (!userName) {
      userName = browser.params && browser.params.userName ? browser.params.userName : 'dev@propertyme.com';
    }
    if (!password)  {
      password = browser.params && browser.params.password ? browser.params.password : 'es3mb9kwk0';
    }

    this.navigateToSignIn();

    element(by.name('username')).sendKeys(userName);
    element(by.name('password')).sendKeys(password);
    element(by.css('[type="submit"]')).click();
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }

  testRentActivityCard(card: any, amount: string, isOverDue : boolean) {
    this.consolelog('\t\t test rent due card with ' + (isOverDue ? 'over due ' : '' ) + amount);

    const rentCardHeader = card.element(by.css('.card-header'));
    rentCardHeader.getText().then(
      function(text){
        expect(text).toContain('Payment due');
      });

    const titleElement = card.element(by.tagName('h5'));
    expect(titleElement).toBeDefined();
    expect(titleElement.element(by.css('.icon-calendar'))).toBeDefined();

    titleElement.getText().then(
      function(text){
        expect(text.trim()).toEqual('Rent')
      }
    )

    if (isOverDue) {
      const overDueBadge = card.element(by.css('.badge.badge-danger'));
      expect(overDueBadge).toBeDefined();

      const badgeContent = overDueBadge.element(by.tagName('span'));
      expect(badgeContent).toBeDefined();

      badgeContent.getText().then(
        (text : string) => {
          expect(text).toContain('OVERDUE');
        }
      );
    }

    const contentElement = card.element(by.css('.card-body .card-smaller-text'));
    contentElement.getText().then(
      function(text){
        expect(text).toContain('Rent from');
      }
    )

    const amountElement = card.element(by.css('.text-right > h5'));
    amountElement.getText().then(
      function(text){
        expect(text.trim()).toEqual(amount);
      }
    )
  }

  testInspectionCard(card: any, cardType: string, inspectionType: string) {
    const rentCardHeader = card.element(by.css('.card-header'));
    rentCardHeader.getText().then(
      function(text){
        expect(text).toContain(cardType);
      });

    const titleElement = card.element(by.tagName('h5'));
    expect(titleElement).toBeDefined();
    expect(titleElement.element(by.css('.icon-clipboard'))).toBeDefined();

    const dateElement = card.element(by.css('.col-6.text-right.card-smaller-text'));
    expect(dateElement).toBeDefined();

    card.all(by.css('.row')).then((items) => {
      expect(items.length).toBeGreaterThanOrEqual(3);

      const typeElement = items[2];

      typeElement.getText().then(
        function(text){
          expect(text).toContain(inspectionType);
        });
    });
  }

  testJobActivityCard(card: any, jobStatus: string) {
    this.consolelog('test job activity card: ' + jobStatus);
    const jobCardHeader = card.element(by.css('.card-header'));
    if (jobCardHeader) {
      jobCardHeader.getText().then(
        function(text){
          expect(text.toLowerCase()).toContain(jobStatus);
        });
    }


    const titleElement = card.element(by.tagName('h5'));
    expect(titleElement).toBeDefined();
    expect(titleElement.element(by.css('.icon-tools'))).toBeDefined();

    const statusElement = card.element(by.css('.badge'));
    expect(statusElement).toBeDefined();

    statusElement.getText().then(
      function(text){
        expect(text.toLowerCase()).toContain(jobStatus.toLowerCase());
      });

    const descriptionElement = card.element(by.css('.text-justify.card-smaller-text'));
    expect(descriptionElement).toBeDefined();

    const referenceElement = card.element(by.cssContainingText('strong', 'Job reference'));
    expect(referenceElement).toBeDefined();
  }

  formatCurrency(value) {
    return new CurrencyPipe('en-AU').transform(value,
      'USD',
      true,
      '1.2-2' );
  }

  formatLoalDate(value) {
    return new DatePipe('en-AU').transform(value,'d MMMM yyyy')
  }

  consolelog(message: string) {
    if (browser.params && browser.params.debugMode) {
      console.log(message);
    }
  }
}
