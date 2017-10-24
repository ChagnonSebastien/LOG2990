import { Component, OnInit, Input } from '@angular/core';
import { Track } from '../track';
import { TrackService } from './track.service';

@Component({
    selector: 'app-track-detail',
    templateUrl: './track-detail.component.html',
    styleUrls: ['./track-detail.component.css'],
    providers: [TrackService]
})
export class TrackDetailComponent implements OnInit {
    @Input() public  track: Track;

    public changeDescriptionDB() {
        this.trackService.changeTrackDescription(this.track.name, this.track.description).subscribe(
        );
    }

    public changeTypeDB() {
        this.trackService.changeTrackType(this.track.name, this.track.type).subscribe(
        );
    }

    public changeNameDB() {
        this.trackService.changeTrackName(this.track.name, this.track.name).subscribe(
        );
    }

    public save() {
        this.changeNameDB();
        this.changeDescriptionDB();
        this.changeTypeDB();
    }

    public setTrack(track: Track) {
        this.track = track;
    }

    constructor(private trackService: TrackService) { }

    public ngOnInit() {
    }

}
