import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from './authentication.service';

@Component({
    selector: 'app-authentication-component',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
    public passwordCorrect: boolean;
    public passwordChanged: boolean;

    constructor(private authenticationService: AuthenticationService) { }

    public ngOnInit(): void {
        this.passwordCorrect = false;
        this.passwordChanged = false;
      //  this.modifyPassword = false;
    }

    public async login(passwordInput: string): Promise<boolean> {
        await this.authenticationService.authenticate(passwordInput).then(res => {
            this.passwordCorrect = (res === 'authenticated');
        });
        return await this.passwordCorrect;
    }

    public async changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
        await this.authenticationService.changePassword(oldPassword, newPassword).then(res => {
            this.passwordChanged = (res === 'success');
        });
        return await this.passwordChanged;
    }

   // public toggleChangePassword(): void {
    //    this.modifyPassword = this.modifyPassword ? false : true;
    // }
}
