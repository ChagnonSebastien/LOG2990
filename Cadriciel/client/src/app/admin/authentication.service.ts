import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthenticationService {

    constructor(private http: Http) { }

    private headers = new Headers({'Content-Type': 'application/json'});

    public authenticate(password: string): Promise<string> {
        const url = 'http://localhost:3000/api/login';
        return this.http
                .post(url, JSON.stringify({'password': password}), {headers: this.headers})
                .toPromise()
                .then(response => response.json().data)
                .catch(this.handleError);
    }

    public changePassword(oldPassword: string, newPassword: string): Promise<string> {
        const url = 'http://localhost:3000/api/changepassword';
        const passwords = {
            'oldPassword': oldPassword,
            'newPassword': newPassword
        };
        return this.http
        .post(url, JSON.stringify(passwords), {headers: this.headers})
        .toPromise()
        .then(response => response.json().data)
        .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
