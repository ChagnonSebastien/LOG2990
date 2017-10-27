import { ActivatedRoute } from '@angular/router';
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
    public selectedTrack = '';
    constructor(private trackService: TrackService, private http: Http, private route: ActivatedRoute) { }

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

    public select(track) {
        this.selectedTrack = track.name;
    }

    public getTracks() {
        return this.http.get('http://localhost:3000/api/tracks').map(res => res.json());
    }

    public addTracks(newTrack) {

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/api/tracks', newTrack, { headers: headers }).map(res => res.json());
    }
}
