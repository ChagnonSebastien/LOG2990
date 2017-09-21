import { Component, OnInit } from '@angular/core';
import { Track } from './track';

@Component({
    selector: 'tracks',
    templateUrl: './tracks.component.html',
    styleUrls: ['./tracks.component.css'],
    providers: []
})
export class TracksComponent implements OnInit {

    tracks: Track[];
    selectedTrack: Track;

    constructor() {

    }

    ngOnInit() {
        
    }


}