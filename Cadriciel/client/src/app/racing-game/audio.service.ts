import { Injectable } from '@angular/core';

@Injectable()
export class AudioService {
    private countdown: HTMLAudioElement;
    private race: HTMLAudioElement;
    private stinger: HTMLAudioElement;
    private themed: HTMLAudioElement;

    constructor() {
        this.countdown = new Audio('../../assets/sounds/countdown.mp3');
        this.countdown.load();
        this.race = new Audio('../../assets/sounds/race.mp3');
        this.race.load();
        this.stinger = new Audio('../../assets/sounds/stinger.mp3');
        this.stinger.load();
        this.themed = new Audio('../../assets/sounds/themed.mp3');
        this.themed.load();
    }

    public startCountdown() {
        this.countdown.play();
    }
}
