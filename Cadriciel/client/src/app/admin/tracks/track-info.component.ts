import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Track } from './track'
import { TrackService } from './track.service';

@Component({
    selector: 'app-track-info',
    templateUrl: './track-info.component.html',
    styleUrls: ['./track-info.component.css'],
    providers: [TrackService]
})
export class TrackInfoComponent implements OnInit {
    @Input() track: Track;

    changeDescriptionDB() {
        this.trackService.changeTrackDescription(this.track.trackId, this.track.description).subscribe(data => {

        });

    }
    changeTypeDB() {
        this.trackService.changeTrackType(this.track.trackId, this.track.type).subscribe(data => {

        });

    }
    changeNameDB() {
        this.trackService.changeTrackName(this.track.trackId, this.track.name).subscribe(data => {

        });

    }

    save() {
        this.changeNameDB();
        this.changeDescriptionDB();
        this.changeTypeDB();
    }

    constructor(private trackService: TrackService) { }

    ngOnInit() {
    }

}
