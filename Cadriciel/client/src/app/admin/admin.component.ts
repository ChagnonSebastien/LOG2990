import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from './authentication.service';

@Component({
    selector: 'admin-component',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    private passwordCorrect: boolean;
    private passwordChanged: boolean;

    constructor(private authenticationService: AuthenticationService) { }

    public ngOnInit(): void {
        this.passwordCorrect = false;
        this.passwordChanged = false;
    }

    public async login(passwordInput: string): Promise<boolean> {
        await this.authenticationService.authenticate(passwordInput).then(res => {
            this.passwordCorrect = (res == 'authenticated');
        });
        return await this.passwordCorrect;
    }

    public async changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
        await this.authenticationService.changePassword(oldPassword, newPassword).then(res => {
            this.passwordChanged = (res == 'success');
        });
        return await this.passwordChanged;
    }
}