import { Component, OnInit, Input}                              from '@angular/core';
import { NgbActiveModal}                                  from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService, AuthenticateResponse }    from '../_services/index';
import { Alert }                                          from '../model/alert';
import { Router }                                         from '@angular/router';

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInDialogComponent implements OnInit {
  model: any = {};
  loading: boolean;
  returnUrl: string;
  alert: Alert;

  constructor(
    public activeModal: NgbActiveModal,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {
    this.loading = false;
  }

  ngOnInit() {
      const session = this.authenticationService.loadSession();
      if (session) {
          this.model.username = session.UserName;
      }
  }

  login() {
    this.loading = true;
    const that = this;
    this.authenticationService.login(this.model.username.trim(), this.model.password, true)
      .then(r => {
        that.activeModal.close();
      })
      .catch((error: AuthenticateResponse) => {
        if (error.responseStatus) {
          var msg = error.responseStatus.message == 'Invalid UserName or Password'
          ? 'Email or password is invalid'
          : error.responseStatus.message;
          that.alert = new Alert(msg, 'danger');
        }

        that.loading = false;
      })
      .catch((err: any) => {
        console.log(err);
        that.loading = false;
      });

  }

  signOut() {
    this.activeModal.dismiss('Sign out')
  }

}
