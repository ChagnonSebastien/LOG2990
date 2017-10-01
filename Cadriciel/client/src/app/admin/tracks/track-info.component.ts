import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Track } from './track';
import { TrackService } from './track.service';

@Component({
    selector: 'app-track-info',
    templateUrl: './track-info.component.html',
    styleUrls: ['./track-info.component.css'],
    providers: [TrackService]
})
export class TrackInfoComponent implements OnInit {
    @Input() public track: Track;

    public changeDescriptionDB() {
        this.trackService.changeTrackDescription(this.track.trackId, this.track.description).subscribe(
            result => console.log(result)
        );
    }

    public changeTypeDB() {
        this.trackService.changeTrackType(this.track.trackId, this.track.type).subscribe(
            result => console.log(result)
        );
    }

    public changeNameDB() {
        this.trackService.changeTrackName(this.track.trackId, this.track.name).subscribe(
            result => console.log(result)
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
