import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from './authentication.service';

@Component({
    selector: 'admin-component',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    public passwordInput: string;
    private passwordCorrect: boolean;

    constructor(private authenticationService: AuthenticationService) { }

    public ngOnInit(): void {
        this.passwordCorrect = false;
    }

    public login(passwordInput: string): boolean {
        if (passwordInput == 'walleandtomato') {
            this.passwordCorrect = true;
        }
        return this.passwordCorrect;
    }
}