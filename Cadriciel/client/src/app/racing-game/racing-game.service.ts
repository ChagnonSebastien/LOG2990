import { Track } from './track';
import { Injectable } from '@angular/core';

@Injectable()
export class RacingGameService {
    private track: Track;

    constructor() {
    }

    public initialize(track: Track): void {
        this.track = track;
    }

    public getTrack(): Track {
        return this.track;
    }

}
