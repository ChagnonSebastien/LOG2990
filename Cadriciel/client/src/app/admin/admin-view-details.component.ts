import { Track } from './../racing-game/track';
import { TrackService } from './../racing-game/game-initialization/track.service';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

const apiUrl = 'http://localhost:3000/api';

@Component({
    selector: 'app-admin-view-details-component',
    templateUrl: './admin-view-details.component.html',
    styleUrls: ['./admin-view-details.component.css']
})
export class AdminViewDetailsComponent implements OnInit {
    public track: Track = new Track('', '', '', [], [], [], []);

    constructor(private route: ActivatedRoute, private http: Http, private trackService: TrackService) { }

    public ngOnInit(): void {
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
                })
                .catch(this.handleError);
            }
        );
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    public async delete(): Promise<boolean> {
        let response = false;
        await this.trackService.deleteTrack(this.track).then(res => {
            response = (res !== 'connectionError');
        });
        return response;
    }
}
