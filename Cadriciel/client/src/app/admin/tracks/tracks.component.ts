import { Component, OnInit } from '@angular/core';
import { TrackService } from './track.service';
import { Track } from './track';


@Component({
    selector: 'app-tracks',
    templateUrl: './tracks.component.html',
    styleUrls: ['./tracks.component.css'],
    providers: [TrackService]
})
export class TracksComponent implements OnInit {

    public tracks: Track[];
    public selectedTrack: Track;
    constructor(private trackService: TrackService) { }

    public ngOnInit() {
        this.trackService.getTracks().subscribe(tracks => this.tracks = tracks);
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
}
