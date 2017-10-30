import { Component, OnInit } from '@angular/core';

import { User } from '../racing-game/game-initialization/user';

@Component({
    selector: 'app-admin-view-component',
    templateUrl: './admin-view.component.html',
    styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit {
    public userType: User = User.Administrator;
    public selectedTab = 'settings';

    constructor() { }

    public ngOnInit(): void {
    }

    public select(selectedTab) {
        this.selectedTab = selectedTab;
    }
}
