import { Injectable } from '@angular/core';

@Injectable()
export class AudioService {
    private countdown: HTMLAudioElement;

    constructor() {
        this.countdown = new Audio('../../assets/sounds/countdown.mp3');
        this.countdown.load();
    }

    public startCountdown() {
        this.countdown.play();
    }
}
