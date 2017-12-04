import { RaceEventService } from './events/race-event.service';
import { ObstacleType } from './draw-track/obstacle';
import { Injectable } from '@angular/core';
import { Settings } from './settings';

@Injectable()
export class AudioService {
    private countdown: HTMLAudioElement;
    private race: HTMLAudioElement;
    private stinger: HTMLAudioElement;
    private themed: HTMLAudioElement;
    private carCarCollision: HTMLAudioElement;
    private engineStart: HTMLAudioElement;
    private idleEngine: HTMLAudioElement;
    private accelerate: HTMLAudioElement;
    private hitWall: HTMLAudioElement;
    private hitPothole: HTMLAudioElement;
    private acceleratorBonusStart: HTMLAudioElement;
    private acceleratorBonusEnd: HTMLAudioElement;

    constructor() {
        this.countdown = new Audio(`${Settings.ASSETS_FOLDER}/${Settings.SOUND_COUNTDOWN}`);
        this.countdown.load();
        this.race = new Audio(`${Settings.ASSETS_FOLDER}/${Settings.SOUND_RACE}`);
        this.race.load();
        this.stinger = new Audio(`${Settings.ASSETS_FOLDER}/${Settings.SOUND_STIGNER}`);
        this.stinger.load();
        this.themed = new Audio(`${Settings.ASSETS_FOLDER}/${Settings.SOUND_THEMED}`);
        this.themed.load();
        this.carCarCollision = new Audio('../../assets/sounds/car_car_collision.mp3');
        this.carCarCollision.load();
        this.engineStart = new Audio('../../assets/sounds/carStart.mp3');
        this.engineStart.load();
        this.idleEngine = new Audio('../../assets/sounds/idleEngine.mp3');
        this.idleEngine.load();
        this.accelerate = new Audio('../../assets/sounds/carAcceleration.mp3');
        this.accelerate.load();
        this.hitPothole = new Audio('../../assets/sounds/pothole.mp3');
        this.acceleratorBonusStart = new Audio('../../assets/sounds/acceleratorBonusStart.mp3');
        this.acceleratorBonusStart.load();
        this.acceleratorBonusEnd = new Audio('../../assets/sounds/acceleratorBonusEnd.mp3');
        this.acceleratorBonusEnd.load();
        this.hitWall = new Audio('../../assets/sounds/hitWall.mp3');
        this.hitWall.load();
    }

    public startCountdown(): void {
        this.countdown.play();
        this.engineStart.play();
        this.countdown.addEventListener(Settings.MUSIC_ENDED_EVENT, () => {
            this.startRace();
        });
    }

    public startRace(): void {
        this.race.loop = true;
        this.idleEngine.loop = true;
        this.idleEngine.play();
        this.race.play();
    }

    public stopRace(): void {
        this.race.pause();
    }

    public startBooster(): void {
        this.acceleratorBonusStart.play().then(() => this.endBooster());
    }

    public startHitPothole(): void {
        this.hitPothole.play();
    }

    public startCarCarCollision(): void {
        this.engineStopAccelerate();
        this.carCarCollision.play();
    }

    public engineAccelerate(): void {
        this.accelerate.loop = true;
        this.accelerate.play();
    }

    public engineStopAccelerate(): void {
        this.accelerate.pause();
        this.accelerate.currentTime = 0;
    }

    public handleObstacleCollision(obstacleType: ObstacleType) {
        switch (obstacleType) {

            case 1.75:
                this.startHitPothole();
                this.engineStopAccelerate();
                this.acceleratorBonusStart.pause();
                this.acceleratorBonusStart.currentTime = 0;
                break;
            case 2.75:
                this.startBooster();
                break;
        }
    }

    public endBooster(): void {
        this.acceleratorBonusEnd.play();
    }

    public carHitWall() {
        this.acceleratorBonusStart.pause();
        this.acceleratorBonusStart.currentTime = 0;
        this.hitWall.play();
    }

    public startStinger(): void {
        this.stinger.play();
        this.stinger.addEventListener(Settings.MUSIC_ENDED_EVENT, () => {
            this.startThemed();
        });
    }

    private startThemed(): void {
        this.themed.loop = true;
        this.themed.play();
    }
}
