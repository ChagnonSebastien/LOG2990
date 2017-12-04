import { RaceEventService } from './events/race-event.service';
import { Injectable } from '@angular/core';
import { Settings } from './settings';

@Injectable()
export class AudioService {
    private countdown: HTMLAudioElement;
    private race: HTMLAudioElement;
    private stinger: HTMLAudioElement;
    private themed: HTMLAudioElement;

    constructor(private raceService: RaceEventService) {
        this.listenForEndOfRace();
        this.countdown = new Audio(`${Settings.ASSETS_FOLDER}/${Settings.SOUND_COUNTDOWN}`);
        this.countdown.load();
        this.race = new Audio(`${Settings.ASSETS_FOLDER}/${Settings.SOUND_RACE}`);
        this.race.load();
        this.stinger = new Audio(`${Settings.ASSETS_FOLDER}/${Settings.SOUND_STIGNER}`);
        this.stinger.load();
        this.themed = new Audio(`${Settings.ASSETS_FOLDER}/${Settings.SOUND_THEMED}`);
        this.themed.load();
    }

    public startCountdown() {
        this.countdown.play();
        this.countdown.addEventListener(Settings.MUSIC_ENDED_EVENT, () => {
            this.startRace();
        });
    }

    public startRace() {
        this.race.loop = true;
        this.race.play();
    }

    public stopRace() {
        this.race.pause();
    }

    private listenForEndOfRace() {
        this.raceService.raceEndedAlerts().subscribe(() => {
            this.stopRace();
            this.startStinger();
        });
    }

    private startStinger() {
        this.stinger.play();
        this.stinger.addEventListener(Settings.MUSIC_ENDED_EVENT, () => {
            this.startThemed();
        });
    }

    private startThemed() {
        this.themed.loop = true;
        this.themed.play();
    }
}
