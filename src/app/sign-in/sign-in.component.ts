import { TenancyListInfo, TenancyService } from '../renting-card/services/tenancy.service';
import { PortalSession } from '../_common/portal-session';
import { Component, OnInit }                            from '@angular/core';
import { Router, ActivatedRoute }                       from '@angular/router';
import { NgbModal, NgbModalRef }                        from '@ng-bootstrap/ng-bootstrap';
import { AuthenticateResponse, AuthenticationService } from '../_services/index';
import { AppComponent } from '../app.component';
import { Alert } from '../model/alert';
import { SignUpEmailComponent } from '../sign-up/email/email.component';
import { AgentService, AgentInfo }  from '../agent-card/services/agent.service';
import { ResetPasswordDialogComponent } from './reset-password/reset-password-dialog/reset-password-dialog.component';
import { PortfolioResponse } from '../_services/authentication.model';
import { AcceptTermsDialogComponent } from '../sign-in/accept-terms/accept-terms-dialog.component';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  model: any = {};
  loading: boolean;
  returnUrl: string;
  portfolioCode: string = null;
  alert: Alert = null;
  message: Alert = null;
  popupRef: NgbModalRef;
  portfolio: PortfolioResponse = null;
  noLogo: boolean = false;

  ownerportalReferrerUrl: string = '';
  redirectToAfterAcceptTerm: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private rootComp: AppComponent,
    private modalService: NgbModal,
    private agentService: AgentService,
    private tenantService: TenancyService,
    private portalSession : PortalSession
  ) {
    this.rootComp.hideNavbar();

    this.loading = false;
  }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    this.portfolioCode = this.route.snapshot.queryParams['code'];

    if (this.portfolioCode) {
      this.loading = true;
      this.authenticationService.getPortfolioByCode(this.portfolioCode)
        .then(response => {
           this.portfolio = response;
           this.loading = false;
           if (!response.LogoDocumentStorageId) {
               this.noLogo = true;
           }
        })
        .catch((err: any) => {
          this.loading = false;
          console.log(err);
        });
    }

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.loading = true;
    const that = this;
    const userName = that.model.username || '';
    this.authenticationService.login(userName.trim(), that.model.password)
      .then( authenResponse => {

          if (authenResponse && authenResponse.Meta) {
              const termsVersion =  authenResponse.Meta['TermsVersion'];
              const acceptConditionsVersion =  authenResponse.Meta['AcceptTermsVersion'];

              if (!acceptConditionsVersion || Number(termsVersion) !== Number(acceptConditionsVersion) ) {
                  that.redirectToAfterAcceptTerm = true;
                  that.ownerportalReferrerUrl = authenResponse.ReferrerUrl;
                  if (that.portalSession && that.portalSession.session) {
                      that.portalSession.session.TermsVersion = termsVersion;
                      that.acceptTerms();
                  }
              }
          }


        //  if the term had been accepted, redirect to target page
        if (!that.redirectToAfterAcceptTerm) {
            if (authenResponse && authenResponse.ReferrerUrl) {
                window.location.href = authenResponse.ReferrerUrl;
            } else {
                this.rootComp.showNavbar();
                that.router.navigate([that.returnUrl]);
            }
        }


        that.loading = false;
      })
      .catch((error: AuthenticateResponse) => {
        // this.alertService.error(error.responseStatus.message);
        if (error.responseStatus) {
          const msg = error.responseStatus.message === 'Invalid UserName or Password'
            ? 'Email or password is invalid'
            : error.responseStatus.message;
          that.alert = new Alert(msg, 'danger');


          that.message = new Alert('test', 'info');
        }

        that.loading = false;
      })
      .catch((err: any) => {
        console.log(err);
        that.loading = false;
      });
  }

  acceptTerms() {
      const that = this;
      if (!that.popupRef) {
          that.popupRef = that.modalService.open(AcceptTermsDialogComponent, { backdrop: 'static', windowClass: 'term-modal'});

          that.popupRef.result
              .then((result) => {
                  that.popupRef = null;
                  if (result !== 'accept') {
                    this.router.navigate(['/sign-in']);
                  } else {
                    if (that.redirectToAfterAcceptTerm) {
                      if (that.ownerportalReferrerUrl) {
                        window.location.href = that.ownerportalReferrerUrl;
                      } else {
                        this.rootComp.showNavbar();
                        that.router.navigate([that.returnUrl]);
                      }
                    }
                  }
              }, () => {
                that.popupRef = null;
                this.router.navigate(['/sign-in']);
              })
              .catch(() => {
                      that.popupRef = null;
                      this.router.navigate(['/sign-in']);
                  }
              );

      }
  }

  signUp($event) {
    $event.preventDefault();
    const that = this;
    if (!that.popupRef) {
        that.popupRef = this.modalService.open(SignUpEmailComponent, { size: 'lg'});

        // pass the portfolio code to signup modal
        (<SignUpEmailComponent>that.popupRef.componentInstance).portfolioCode = that.portfolioCode;

        that.popupRef.result
            .then((resolve) => { that.popupRef = null; }, () => { that.popupRef = null; } )
            .catch((reject) => { that.popupRef = null; });
    }
  }

  resetPassword($event) {
    $event.preventDefault();
    const that = this;
    if (!that.popupRef) {
        that.popupRef = this.modalService.open(ResetPasswordDialogComponent, { size: 'lg'});

        that.popupRef.result
        .then((resolve) => { that.popupRef = null; }, () => { that.popupRef = null; } )
        .catch((reject) => { that.popupRef = null; });

    }
  }
}
