import { Component, OnInit } from '@angular/core';

import { User } from '../racing-game/game-initialization/user';

@Component({
    selector: 'app-admin-view-settings-component',
    templateUrl: './admin-view-settings.component.html',
    styleUrls: ['./admin-view-settings.component.css']
})
export class AdminViewSettingsComponent implements OnInit {
    public userType: User = User.Administrator;

    constructor() { }

    public ngOnInit(): void {

    }
}
