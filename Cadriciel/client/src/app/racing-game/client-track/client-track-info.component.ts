import { Component, OnInit, Input } from '@angular/core';
import { Track } from '../../admin/tracks/track';
import { TrackService } from '../../admin/tracks/track.service';

@Component({
    selector: 'app-client-track-info',
    templateUrl: './client-track-info.component.html',
    styleUrls: ['./client-track-info.component.css'],
    providers: [TrackService]
})
export class ClientTrackInfoComponent implements OnInit {
    @Input() public  track: Track;

    public changeDescriptionDB() {
        this.trackService.changeTrackDescription(this.track.trackId, this.track.description).subscribe(
        );
    }

    public changeTypeDB() {
        this.trackService.changeTrackType(this.track.trackId, this.track.type).subscribe(
        );
    }

    public changeNameDB() {
        this.trackService.changeTrackName(this.track.trackId, this.track.name).subscribe(
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
