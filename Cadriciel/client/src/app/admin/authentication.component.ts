import { Component, OnInit, Input } from '@angular/core';

import { AuthenticationService } from './authentication.service';
import { User } from '../racing-game/game-initialization/user';
@Component({
    selector: 'app-authentication-component',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
    @Input() public userType: User;
    public passwordCorrect: boolean;
    public passwordChanged: boolean;
    public accountSettings: boolean;
    public racingGameSettings: boolean;

    constructor(private authenticationService: AuthenticationService) { }

    public ngOnInit(): void {
        this.passwordCorrect = false;
        this.passwordChanged = false;
        this.accountSettings = true;
        this.racingGameSettings = false;
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
    public toggleAccountSettings(): void {
        this.racingGameSettings = false;
        this.accountSettings = true;
    }

    public toggleRacingGameSettings(): void {
        this.racingGameSettings = true;
        this.accountSettings = false;
    }
}
