import { Http } from '@angular/http';
import { Component, OnInit, Input } from '@angular/core';
import { Track } from '../track';
import { TrackService } from './track.service';
import { User } from './user';

const apiUrl = 'http://localhost:3000/api';

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

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    public setTrack(track: Track) {
        this.track = track;
    }

    constructor(
        private trackService: TrackService,
        private http: Http
    ) { }

    public ngOnInit() {
    }

}
