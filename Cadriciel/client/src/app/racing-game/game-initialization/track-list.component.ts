import { Component, OnInit } from '@angular/core';
import { TrackService } from './track.service';
import { Track } from '../track';
import { Http, Headers } from '@angular/http';

@Component({
    selector: 'app-track-list',
    templateUrl: './track-list.component.html',
    styleUrls: ['./track-list.component.css'],
    providers: [TrackService]
})
export class TrackListComponent implements OnInit {

    public tracks: Track[];
    public selectedTrack: Track;
    constructor(private trackService: TrackService, private http: Http) { }

    public ngOnInit() {
        this.getTracks().subscribe(tracks => this.tracks = tracks);
    }

    public onSelect(track: Track): void {
        this.selectedTrack = track;
    }

    public deleteTrack(id: number) {
        const tracks = this.tracks;
        this.trackService.deleteTrack(id).subscribe(data => {
            if (data.n === 1) {
                for (let i = 0; i < tracks.length; i++) {
                    if (tracks[i].trackId === id) {
                        tracks.splice(i, 1);
                    }
                }
            }
        });
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