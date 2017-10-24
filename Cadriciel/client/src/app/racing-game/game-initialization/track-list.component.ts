import { Track } from './../track';
import { Component, OnInit, Input } from '@angular/core';
import { TrackService } from './track.service';
import { Http, Headers } from '@angular/http';
import { User } from './user';

@Component({
    selector: 'app-track-list',
    templateUrl: './track-list.component.html',
    styleUrls: ['./track-list.component.css'],
    providers: [TrackService]
})
export class TrackListComponent implements OnInit {
    @Input() public userType: User;
    public tracks: Track[];
    public selectedTrack: Track;
    constructor(private trackService: TrackService, private http: Http) { }

    public ngOnInit() {
        this.getTracks().subscribe(tracks => this.tracks = tracks.map((track) => {
            return new Track(
                track._id,
                track.description,
                track.type,
                track.trackIntersections,
                track.puddles,
                track.potholes,
                track.boosters
            );
        }));
    }

    public onSelect(track: Track): void {
        this.selectedTrack = track;
    }

    public deleteTrack(name: string) {
        const tracks = this.tracks;
        this.trackService.deleteTrack(name).subscribe(data => {
            if (data.n === 1) {
                for (let i = 0; i < tracks.length; i++) {
                    if (tracks[i].name === name) {
                        tracks.splice(i, 1);
                    }
                }
            }
        });
    }

    public getTracks() {
        return this.http.get('http://localhost:3000/api/tracks').map(res => res.json());
        /*
        new Track(
            res.json()._id,
            res.json().description,
            res.json().type,
            res.json().trackIntersections,
            res.json().puddles,
            res.json().potholes,
            res.json().boosters
        ));*/
    }

    public addTracks(newTrack) {

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/api/tracks', newTrack, { headers: headers }).map(res => res.json());
    }
}
