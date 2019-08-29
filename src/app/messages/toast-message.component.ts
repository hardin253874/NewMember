import {Component,  OnInit} from '@angular/core';
import { Router, ActivatedRoute }   from '@angular/router';
import { Subject, Observable, Subscription } from 'rxjs/Rx';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ToastMessageService } from '../_services/toast-message.service';
@Component({
    selector: 'app-toast-message',
    templateUrl: './toast-message.component.html'
})
export class ToastMessageComponent  implements OnInit {

    themes = [{
        name: 'Default Theme',
        code: 'default'
    }, {
        name: 'Material Design',
        code: 'material'
    }, {
        name: 'Bootstrap',
        code: 'bootstrap'
    }];

    types = [{
        name: 'Default',
        code: 'default',
    }, {
        name: 'Info',
        code: 'info'
    }, {
        name: 'Success',
        code: 'success'
    }, {
        name: 'Wait',
        code: 'wait'
    }, {
        name: 'Error',
        code: 'error'
    }, {
        name: 'Warning',
        code: 'warning'
    }];

    positions = [{
        name: 'Top Left',
        code: 'top-left',
    }, {
        name: 'Top Center',
        code: 'top-center',
    }, {
        name: 'Top Right',
        code: 'top-right',
    }, {
        name: 'Bottom Left',
        code: 'bottom-left',
    }, {
        name: 'Bottom Center',
        code: 'bottom-center',
    }, {
        name: 'Bottom Right',
        code: 'bottom-right',
    }, {
        name: 'Center Center',
        code: 'center-center',
    }];

    position: string = this.positions[5].code;

    options = {
        title: 'Service Error',
        msg: 'An unexpected remote error occurred. Sorry for any inconvenience.',
        showClose: true,
        timeout: 5000,
        theme: this.themes[2].code,
        type: this.types[4].code
    };

    getTitle(num: number): string {
        return 'Countdown: ' + num;
    }

    getMessage(num: number): string {
        return 'Seconds left: ' + num;
    }

    constructor(private toastyService: ToastyService,
                private toastMessageService: ToastMessageService) { }


    ngOnInit() {
        if (this.toastMessageService) {

        }
    }

    newToast() {
        const toastOptions: ToastOptions = {
            title: this.options.title,
            msg: this.options.msg,
            showClose: this.options.showClose,
            timeout: this.options.timeout,
            theme: this.options.theme,
            // position: this.options.position,
            onAdd: (toast: ToastData) => {
                console.log('Toast ' + toast.id + ' has been added!');
            },
            onRemove: function(toast: ToastData) {
                console.log('Toast ' + toast.id + ' has been removed!');
            }
        };

        switch (this.options.type) {
            case 'default': this.toastyService.default(toastOptions); break;
            case 'info': this.toastyService.info(toastOptions); break;
            case 'success': this.toastyService.success(toastOptions); break;
            case 'wait': this.toastyService.wait(toastOptions); break;
            case 'error': this.toastyService.error(toastOptions); break;
            case 'warning': this.toastyService.warning(toastOptions); break;
        }
    }

    newCountdownToast() {
        const interval = 1000;
        const seconds = this.options.timeout / 1000;
        let subscription: Subscription;

        const toastOptions: ToastOptions = {
            title: this.getTitle(seconds || 0),
            msg: this.getMessage(seconds || 0),
            showClose: this.options.showClose,
            timeout: this.options.timeout,
            theme: this.options.theme,
            onAdd: (toast: ToastData) => {
                console.log('Toast ' + toast.id + ' has been added!');
                // Run the timer with 1 second iterval
                const observable = Observable.interval(interval).take(seconds);
                // Start listen seconds bit
                subscription = observable.subscribe((count: number) => {
                    // Update title
                    toast.title = this.getTitle(seconds - count - 1 || 0);
                    // Update message
                    toast.msg = this.getMessage(seconds - count - 1 || 0);
                });

            },
            onRemove: function(toast: ToastData) {
                console.log('Toast ' + toast.id + ' has been removed!');
                // Stop listenning
                subscription.unsubscribe();
            }
        };

        switch (this.options.type) {
            case 'default': this.toastyService.default(toastOptions); break;
            case 'info': this.toastyService.info(toastOptions); break;
            case 'success': this.toastyService.success(toastOptions); break;
            case 'wait': this.toastyService.wait(toastOptions); break;
            case 'error': this.toastyService.error(toastOptions); break;
            case 'warning': this.toastyService.warning(toastOptions); break;
        }
    }

    clearToasties() {
        this.toastyService.clearAll();
    }

    changePosition($event) {
        this.position = $event;
        // Update position of the Toasty Component
        this.toastMessageService.setPosition(this.position);
    }
}
