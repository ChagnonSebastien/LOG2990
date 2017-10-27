import { AuthenticationService } from './authentication.service';
import { Component, OnInit, Input } from '@angular/core';

import { User } from '../racing-game/game-initialization/user';

@Component({
    selector: 'app-admin-component',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    @Input() public userType: User;
    public passwordCorrect: boolean;
    public accountSettings: boolean;
    public racingGameSettings: boolean;

    constructor(private authenticationService: AuthenticationService) { }

    public ngOnInit(): void {
        this.passwordCorrect = false;
    }

    public async login(passwordInput: string): Promise<boolean> {
        await this.authenticationService.authenticate(passwordInput).then(res => {
            this.passwordCorrect = (res === 'authenticated');
        });
        return await this.passwordCorrect;
    }
}
