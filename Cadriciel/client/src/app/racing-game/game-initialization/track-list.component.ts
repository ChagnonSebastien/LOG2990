import { TrackService } from './track.service';
import { Track } from './../track';
import { Component, OnInit, Input } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Component({
    selector: 'app-track-list',
    templateUrl: './track-list.component.html',
    styleUrls: ['./track-list.component.css'],
    providers: []
})
export class TrackListComponent implements OnInit {

    public selectedTrack: string;

    public tracks: string[];

    constructor(private http: Http, private trackService: TrackService) { }

    @Input() set track(selectedTrack: string) {
        this.selectedTrack = selectedTrack;
        this.trackService.getAll().then(tracks => {
            this.tracks = tracks;
        });
    }

    public ngOnInit() {
    }

}
