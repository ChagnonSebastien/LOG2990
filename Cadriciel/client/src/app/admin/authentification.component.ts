import { AuthenticationService } from './authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-authentification-component',
    templateUrl: './authentification.component.html',
    styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent implements OnInit {
    public passwordCorrect: boolean;

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
