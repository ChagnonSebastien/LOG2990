import { Component, OnInit } from '@angular/core';

import { User } from './user';

@Component({
    selector: 'app-player-component',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.css']
})

export class PlayerComponent implements OnInit {
    public trackName: string;

    constructor() { }

    public ngOnInit(): void {

    }

    public onActivate(event) {
        setTimeout(() => { // To respect the unidirectional data flow rule
            this.trackName = event.getRoute().snapshot.params['name'];
            event.getRoute().params.subscribe( params => this.trackName = params.name );
        }, 0);
    }

    public onDeactivate(event) {
        this.trackName = undefined;
    }
}
