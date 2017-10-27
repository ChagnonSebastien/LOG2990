import { Component, OnInit } from '@angular/core';

import { User } from '../racing-game/game-initialization/user';

@Component({
    selector: 'app-admin-view-tracks-component',
    templateUrl: './admin-view-tracks.component.html',
    styleUrls: ['./admin-view-tracks.component.css']
})
export class AdminViewTracksComponent implements OnInit {
    public userType: User = User.Administrator;

    constructor() { }

    public ngOnInit(): void {

    }
}
