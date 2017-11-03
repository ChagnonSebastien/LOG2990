import { Track } from './../track';
import { Component, OnInit, Input } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Component({
    selector: 'app-track-list',
    templateUrl: './track-list.component.html',
    styleUrls: ['./track-list.component.css'],
    providers: []
})
export class TrackListComponent implements OnInit {

    public selectedTrack: string;

    public tracks: Track[];

    constructor(private http: Http) { }

    @Input() set track(selectedTrack: string) {
        this.selectedTrack = selectedTrack;
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

    public ngOnInit() {
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
