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
        private route: ActivatedRoute
    ) { }

    public getRoute() {
        return this.route;
    }

    public ngOnInit() {
        const trackName = this.route.snapshot.params['name'];
        const path = 'track';

        this.http.get(`${apiUrl}/${path}/${trackName}`).toPromise()
        .then(response => {
            const track = response.json();
            this.track = new Track(
                trackName,
                track.description,
                track.type,
                track.trackIntersections,
                track.puddles,
                track.potholes,
                track.boosters
            );
        })
        .catch(this.handleError);

        this.route.params.subscribe(
            (params) => {
                this.http.get(`${apiUrl}/${path}/${params.name}`).toPromise()
                .then(response => {
                    try {
                        const track = response.json();
                        this.track = new Track(
                            params.name,
                            track.description,
                            track.type,
                            track.trackIntersections,
                            track.puddles,
                            track.potholes,
                            track.boosters
                        );
                    } catch (error) {
                        // Does nothing
                    }
                })
                .catch(this.handleError);
            }
        );
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

}
