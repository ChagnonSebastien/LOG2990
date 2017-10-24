import { Component, OnInit } from '@angular/core';

import { User } from './user';

@Component({
    selector: 'app-player-component',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.css']
})

export class PlayerComponent implements OnInit {
    public userType: User = User.Player;

    constructor() { }

    public ngOnInit(): void {

    }
}
