import { RaceService } from './events/race.service';
import { Injectable } from '@angular/core';
import { CollisionEventService } from './events/collision-event.service';

@Injectable()
export class AudioService {
    private countdown: HTMLAudioElement;
    private race: HTMLAudioElement;
    private stinger: HTMLAudioElement;
    private themed: HTMLAudioElement;
    private carCarCollision: HTMLAudioElement;

    constructor(private raceService: RaceService, private collisionEventService: CollisionEventService) {
        this.listenForEndOfRace();
        this.listenForCarCarCollision();
        this.countdown = new Audio('../../assets/sounds/countdown.mp3');
        this.countdown.load();
        this.race = new Audio('../../assets/sounds/race.mp3');
        this.race.load();
        this.stinger = new Audio('../../assets/sounds/stinger.mp3');
        this.stinger.load();
        this.themed = new Audio('../../assets/sounds/themed.mp3');
        this.themed.load();
        this.carCarCollision = new Audio('../../assets/sounds/car_car_collision.mp3');
        this.carCarCollision.load();
    }

    public startCountdown() {
        this.countdown.play();
        this.countdown.addEventListener('ended', () => {
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

    public startCarCarCollision() {
        this.carCarCollision.play();
    }

    private listenForEndOfRace() {
        this.raceService.raceEndedAlerts().subscribe(() => {
            this.stopRace();
            this.startStinger();
        });
    }

    private listenForCarCarCollision() {
        this.collisionEventService.getCollisionObservable().subscribe(() => {
            this.startCarCarCollision();
        });
    }

    private startStinger() {
        this.stinger.play();
        this.stinger.addEventListener('ended', () => {
            this.startThemed();
        });
    }

    private startThemed() {
        this.themed.loop = true;
        this.themed.play();
    }
}
