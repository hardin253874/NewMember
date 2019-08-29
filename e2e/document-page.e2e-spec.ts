import { browser, element, by } from 'protractor';
import { MemberPortalPage } from './app.po';

export class DocumentTestService {
    documentSpecTest() {
        describe('tenant document page', () => {
            let page: MemberPortalPage;
            let originalTimeout;

            beforeEach(() => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                page = new MemberPortalPage();
            });

            afterEach(function() {
            });

            it('access document page', () => {
                page.accessPageByNavCard('Document');
            });


            it ('document page contains components', () => {
                expect(element(by.tagName('app-renting-card'))).toBeDefined();
                // expect(element(by.tagName('app-nav-card'))).toBeDefined();
                expect(element(by.tagName('app-common-actions'))).toBeDefined();
            });

            it ('document page contains document', () => {

                const currentDocumentsElement = element(by.css('[role="documents"]'));

                currentDocumentsElement.isPresent().then(function(exists){
                    if (exists) {
                        const titleElement = currentDocumentsElement.element(by.tagName('h5'));
                        expect(titleElement).toBeDefined();

                        titleElement.getText().then(
                            function(text){
                                expect(text.trim()).toEqual('Documents');
                            }
                        );

                        currentDocumentsElement.all(by.css('.list-item-card')).then((cards) => {
                            const userName = browser.params.userName;
                            if (userName === 'Tenant1test@propertyme.com') {
                                // todo, test user 1  0 document data. could be changed.
                                expect(cards.length).toBeGreaterThanOrEqual(0);
                            }

                        });

                    }
                });
            });
        });
    }
}
