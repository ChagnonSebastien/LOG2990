import { TrackService } from './track.service';
import { Track } from './../track';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';

const apiUrl = 'http://localhost:3000/api';
@Component({
    selector: 'app-track-detail',
    templateUrl: './track-detail.component.html',
    styleUrls: ['./track-detail.component.css']
})
export class TrackDetailComponent implements OnInit {
    public track;

    constructor(
        private http: Http,
        private route: ActivatedRoute,
        private trackService: TrackService
    ) { }

    public getRoute() {
        return this.route;
    }

    public ngOnInit() {
        const trackName = this.route.snapshot.params['name'];
        this.trackService.get(trackName).then(track => this.track = track);

        this.route.params.subscribe(params => {
            this.trackService.get(params.name).then(track => this.track = track);
        });
    }

}
