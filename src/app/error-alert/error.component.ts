import {Component, OnInit, HostListener} from '@angular/core';
import { Router, ActivatedRoute }   from '@angular/router';
import { AppComponent }             from '../app.component';
import { RouterExtService} from '../_services/router-ext.service';
@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
})

export class ErrorComponent implements OnInit {

    returnUrl: string;
    constructor(private route: ActivatedRoute,
                private router: Router,
                private routerExtService: RouterExtService,
                private rootComp: AppComponent) {
        this.rootComp.hideNavbar();
    }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        const previous =  this.routerExtService.getPreviousUrl();
        // when refresh current page, the router previous url is reset to '/'
        // auto redirect to returnUrl if the previous url value is not same.
        if (previous === '/' && previous !== this.returnUrl) {
            console.log(previous);
            this.router.navigate([this.returnUrl]);
        }
    }

    signout() {
        this.router.navigate(['/sign-in']);
    }

    return() {
        this.router.navigate([this.returnUrl]);
    }
}
