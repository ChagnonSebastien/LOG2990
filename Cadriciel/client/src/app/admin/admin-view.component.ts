import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { User } from '../racing-game/game-initialization/user';

@Component({
    selector: 'app-admin-view-component',
    templateUrl: './admin-view.component.html',
    styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit {
    public userType: User = User.Administrator;
    public selectedTab = '';

    constructor(private route: ActivatedRoute) { }

    public ngOnInit(): void {
    }

    public select(selectedTab) {
        this.selectedTab = selectedTab;
    }
}
