import { Component, OnInit } from '@angular/core';
import { TrackService } from './track.service';
import { HttpModule } from '@angular/http';
import { Track } from './track';
@Component({
    selector: 'tracks',
    templateUrl: './tracks.component.html',
    styleUrls: ['./tracks.component.css'],
    providers: [TrackService]
})
export class TracksComponent implements OnInit {

    tracks: Track[];
    selectedTrack: Track;
    constructor(private trackService: TrackService) { }

    ngOnInit() {
        this.trackService.getTracks().subscribe(tracks => this.tracks = tracks)
    }

    onSelect(track: Track): void {
        this.selectedTrack = track;
    }
    deleteTrack(id: number) {
        var tracks = this.tracks;
        this.trackService.deleteTrack(id).subscribe(data => {

            if (data.n == 1) {
                for (var i = 0; i < tracks.length; i++) {
                    if (tracks[i].trackId == id) {
                        tracks.splice(i, 1);
                    }
                }
            }
        })

    }
}