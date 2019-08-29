import { Router, NavigationEnd, NavigationError } from '@angular/router';
import { Component, HostBinding, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { NgbModal, NgbModalRef }                    from '@ng-bootstrap/ng-bootstrap';
import { ErrorAlertComponent, ErrorData }           from './error-alert/error-alert.component';
import { ConnectDialogComponent, ConnectData }      from './connect-dialog/connect-dialog.component';
import { SignInDialogComponent }                    from './sign-in/sign-in-dialog.component';
import { ConnectStatusTypes }                       from './_services/connect-status-types';
import { UtilityService } from './_common/utility.service';
import { environment } from '../environments/environment';
import { PortalSession } from './_common/portal-session';
import { AuthenticationService } from './_services/authentication.service';
import { RouterExtService } from './_services/router-ext.service';
import { ToastMessageService } from './_services/toast-message.service';
import {
  AppWideEventService,
  ErrorEvent,
  ConnectStatusEvent,
  CheckAppVersionEvent,
  MessageEvent
}                                                   from './_services/app-wide-events.service';
import * as moment from "moment";
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
// import * as rg4js from 'raygun4js';
declare var rg4js: RaygunV2;

@Component({
  moduleId: module.id,
  selector: 'body',
  templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {
  @HostBinding('class') public cssClass = '';
  public isNavbarShown = true;

  popupRef: NgbModalRef;
  version: string;
  toastyComponentPosition: string;
  public showNavbar() {
    this.cssClass = 'with-top-navbar';
    this.isNavbarShown = true;
  }

  public hideNavbar() {
    this.cssClass = 'bg-white';
    this.isNavbarShown = false;
  }

    public ngOnInit(): void {
        this.showNavbar(); // enable the navigate bar by default;
        this.version = environment.version;

      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          // Track navigation end
          rg4js('trackEvent', {
            type: 'pageView',
            path: event.url
          });
        } else if (event instanceof NavigationError) {
          // Track navigation error
          rg4js('send', {
            error: event.error
          });
        }
      });
      if (this.portalSession && this.portalSession.session ) {
        //  setUser from portalSession
        rg4js('setUser', {
          identifier: this.portalSession.session.UserName,
          firstName: '',
          fullName: this.portalSession.session.DisplayName
        });
      }
    }

  constructor(
    private eventService : AppWideEventService,
    private router: Router,
    private location: Location,
    private modalService: NgbModal,
    private portalSession: PortalSession,
    private authenticationService : AuthenticationService,
    private utilityService : UtilityService,
    private toastyService: ToastyService,
    private toastMessageService: ToastMessageService,
    private routerExtService: RouterExtService) {
    eventService.unhandledError$.subscribe(error => this.displayError(error));
    eventService.connectStatusEvent$.subscribe(event => this.showConnectStatus(event));
    eventService.checkAppVersionEvent$.subscribe( event => this.checkAppVersion(event));
    eventService.signInEvent$.subscribe( event => this.redirectToSignInPage() );
    eventService.messageEvent$.subscribe(event => this.toastMessage(event))

     // override the route reuse strategy: set reuse route to false
     // https://github.com/angular/angular/issues/13831
     this.router.routeReuseStrategy.shouldReuseRoute = function(){
        return false;
     }

     this.router.events.subscribe((evt) => {
        if (evt instanceof NavigationEnd) {
           // trick the Router into believing it's last link wasn't previously loaded
           this.router.navigated = false;
        }
    });
      // listen the toast message position's changes
      this.toastMessageService.position$.subscribe(pos => this.toastyComponentPosition = pos);
}


  displayError(error : ErrorEvent) {

    console.log(error.message);

    // if (!this.popupRef) {
    //   this.popupRef = this.modalService.open(ErrorAlertComponent, { size: 'lg' });
    //   this.popupRef.componentInstance.error = new ErrorData(error.message, 'Exception');
    //   this.popupRef.result
    //     .then(() => this.popupRef = null)
    //     .catch(() => this.popupRef = null);
    // }

    this.toastMessage(new MessageEvent(
        'default',
        'Service Error',
        'An unexpected remote error occurred. Sorry for any inconvenience.'));
  }

  toastMessage(event: MessageEvent) {
      const position = 'bottom-left';

      const toastOptions: ToastOptions = {
          title: event.title,
          msg: event.message,
          showClose: true,
          timeout: 10000, // 10 seconds
          theme: 'bootstrap',
          onAdd: (toast: ToastData) => {

          },
          onRemove: function(toast: ToastData) {

          }
      };

      this.toastMessageService.setPosition(position);
      switch (event.type) {
          case 'default': this.toastyService.default(toastOptions); break;
          case 'info': this.toastyService.info(toastOptions); break;
          case 'success': this.toastyService.success(toastOptions); break;
          case 'wait': this.toastyService.wait(toastOptions); break;
          case 'error': this.toastyService.error(toastOptions); break;
          case 'warning': this.toastyService.warning(toastOptions); break;
      }
  }

  showConnectStatus(event: ConnectStatusEvent) {
      if (event.status === ConnectStatusTypes.unreachable) {
          this.router.navigate(['/error'], {queryParams: {returnUrl: this.router.url}});
      } else if (event.status === ConnectStatusTypes.offline) {
          this.showConnectDialog(event);
      } else {
          this.toastMessage(new MessageEvent(
              'default',
              'Service Error',
              'An unexpected remote error occurred. Sorry for any inconvenience.'));
      }
  }

  showConnectDialog(event: ConnectStatusEvent) {
    if (!this.popupRef) {
      if (event.status === ConnectStatusTypes.unauthorized) {
          // The ss-id session cookie is HTTPOnly cookie, have to removed by call signout by server
          // Signout only, without clear the client session before sign in

          this.authenticationService.logout()
              .then(() => {
                  this.popupRef = this.modalService.open(SignInDialogComponent, { backdrop : 'static', keyboard : false, size: 'sm' });
                  this.popupRef.result
                      .then(() => { this.utilityService.refreshCurrentRoute(); })
                      .catch((reject) => {
                          console.log(reject);
                          this.router.navigate(['/sign-in']);
                      });
              })
              .catch(() => {
                  this.router.navigate(['/sign-in']);
              });

      }  else {
        if (event.status === ConnectStatusTypes.notPermitted) {
            // if current tenant user is disabled portal access, redirect current page to profile
            this.router.navigate(['/member/profile']);
        }
        this.popupRef = this.modalService.open(ConnectDialogComponent, { size: 'sm', windowClass: 'dark-modal' });
        this.popupRef.componentInstance.model = new ConnectData(event.status, event.message);
      }

      if (this.popupRef) {
          this.popupRef.result
              .then(() => this.popupRef = null)
              .catch(() => this.popupRef = null);
      }
    }
  }


    redirectToSignInPage() {
        const returnUrl = this.router.url;
        console.log('Current location path ' + returnUrl);
        this.router.navigate(['/sign-in'], {queryParams: {returnUrl: returnUrl}});
    }

  checkAppVersion(event: CheckAppVersionEvent) {
    this.utilityService.getCurrentAppVersion()
      .then(
        setting => {
          if (setting && setting.Version) {
            if (this.version !== setting.Version) {
              window.location.reload();
            }
          }
        }
      );
  }
}
