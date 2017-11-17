import { TrackService } from './track.service';
import { Track } from './../track';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-track-detail',
    templateUrl: './track-detail.component.html',
    styleUrls: ['./track-detail.component.css']
})
export class TrackDetailComponent implements OnInit {
    public track: Track;
    public bestTimesDisplayed: boolean;

    constructor(
        private route: ActivatedRoute,
        private trackService: TrackService
    ) { }

    public getRoute() {
        return this.route;
    }

    public ngOnInit() {
        this.bestTimesDisplayed = false;
        const trackName = this.route.snapshot.params['name'];
        this.trackService.get(trackName).then(track => {
            this.track = track;
        });

        this.route.params.subscribe(params => {
            this.trackService.get(params.name).then(track => this.track = track);
        });
    }

    public showBestTimes() {
        this.bestTimesDisplayed = true;
    }

}
