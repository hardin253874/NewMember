import { MemberPortalPage } from './app.po';
import {browser, by} from 'protractor';

describe('PropertyMe Identity Service App', () => {
  let page: MemberPortalPage;

  beforeEach(() => {
    page = new MemberPortalPage();
  });

  it('should display sign-in form', () => {
    page.navigateToSignInWithMoreTimeout(60000);
    const signInButton = browser.driver.findElement(by.css('[type="submit"]'));
    signInButton.getText().then(function (text) {
        expect(text).toBe('Sign In');
      });
  });
});
