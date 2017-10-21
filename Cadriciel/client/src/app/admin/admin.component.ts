import { Component, OnInit } from '@angular/core';

import { User } from '../racing-game/client-track/user';

@Component({
    selector: 'app-admin-component',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    public userType: User = User.Administrator;

    constructor() { }

    public ngOnInit(): void {

    }
}
