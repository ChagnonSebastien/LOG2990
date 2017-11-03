import { TrackService } from './track.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-track-list',
    templateUrl: './track-list.component.html',
    styleUrls: ['./track-list.component.css'],
    providers: []
})
export class TrackListComponent implements OnInit {

    public selectedTrack: string;

    public tracks: string[];

    constructor(private trackService: TrackService) { }

    @Input() set track(selectedTrack: string) {
        this.selectedTrack = selectedTrack;
        this.trackService.getAll().then(tracks => {
            this.tracks = tracks;
        });
    }

    public ngOnInit() {
    }

}
