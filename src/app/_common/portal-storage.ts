import { Injectable } from '@angular/core';
import { IPortalStorage } from './portal-storage-interface';
@Injectable()
export class PortalLocalStorage implements IPortalStorage {
    name() {
        return 'PortalLocalStorage';
    }

    set(key: string, item: string) {
        if (key) {
            localStorage.setItem(key, item);
        }
    }

    get(key: string): string {
        if (key) {
            return localStorage.getItem(key);
        }
    }

    reset(key: string) {
        if (key) {
            localStorage.setItem(key, null);
        }
    }

    remove(key: string) {
        if (key) {
            localStorage.removeItem(key);
        }
    }
}

export class PortalCookieStorage implements  IPortalStorage {

    addCookieExpireDate: string;
    delCookieExpireDate: string;

    constructor() {
        let date = new Date();
        // Set it expire in 7 days
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
        this.addCookieExpireDate = date.toUTCString();
        // Set removed expir on 24 hours ago
        date = new Date();
        date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
        this.delCookieExpireDate = date.toUTCString();
    }
    name() {
        return 'PortalCookieStorage';
    }

    set(key: string, item: string) {
        if (key) {
            window.document.cookie = key + '=' + this.replaceSemicolon(item) + '; expires=' +  this.addCookieExpireDate + '; path=/';
        }
    }

    get(key: string): string {
        if (key && this.exists(key)) {
            const regexpStr = '(?:^|.*;\\s*)' +
                key.replace(/[\-\.\+\*]/g, '\\$&') +
                '\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*';

            return this.restoreSemicolon(window.document.cookie.replace(new RegExp(regexpStr), '$1'));
        }
    }

    reset(key: string) {
        if (key && this.exists(key)) {
            window.document.cookie = key + '=; expires=' +  this.delCookieExpireDate + '; path=/';
        }
    }

    remove(key: string) {
        if (key && this.exists(key)) {
            window.document.cookie = key + '=; expires=' +  this.delCookieExpireDate + '; path=/';
        }
    }

    replaceSemicolon(value: string): string {
        return value.replace(';', '%3');
    }

    restoreSemicolon(value: string): string {
        return value.replace('%3', ';');
    }


    exists(key: string): boolean {
        return (new RegExp('(?:^|;\\s*)' + key.replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(window.document.cookie);
    }
}
