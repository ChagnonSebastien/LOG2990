import { Component, OnInit, Input } from '@angular/core';
import { Track } from '../track';
import { TrackService } from './track.service';
import { User } from './user';


@Component({
    selector: 'app-track-detail',
    templateUrl: './track-detail.component.html',
    styleUrls: ['./track-detail.component.css'],
    providers: [TrackService]
})
export class TrackDetailComponent implements OnInit {
    @Input() public userType: User;
    @Input() public track: Track;

    public async delete(): Promise<boolean> {
        let response = false;
        await this.trackService.deleteTrack(this.track).then(res => {
            response = (res === 'success');
        });
        return response;
    }

    public setTrack(track: Track) {
        this.track = track;
    }

    constructor(
        private trackService: TrackService,
    ) { }

    public ngOnInit() {
    }

}
