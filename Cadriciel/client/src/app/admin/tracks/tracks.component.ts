import { Component, OnInit } from '@angular/core';
import { Track } from './track';

@Component({
    selector: 'app-tracks',
    templateUrl: './tracks.component.html',
    styleUrls: ['./tracks.component.css'],
    providers: []
})
export class TracksComponent implements OnInit {

    public tracks: Track[];
    public selectedTrack: Track;

    constructor() {

    }

    public ngOnInit() {

    }
}
