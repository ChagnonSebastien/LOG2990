import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CountdownService {
    private audio: HTMLAudioElement;

    constructor() {
        this.audio = new Audio('../../assets/countdown.mp3');
        this.audio.load();
    }

    public startCountdown(countdown: Observable<number>, count: number): Observable<number> {
        this.startAudio();
        countdown = Observable.timer(0, 1000)
            .take(count)
            .map(() => --count);
        return countdown;
    }

    public startAudio() {
        this.audio.play();
    }
}
