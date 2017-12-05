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
        this.carCarCollision = new Audio(`${Settings.ASSETS_FOLDER}/${Settings.SOUND_CAR_CAR_COLLISION}`);
        this.carCarCollision.load();
        this.engineStart = new Audio(`${Settings.ASSETS_FOLDER}/${Settings.SOUND_ENGINE_START}`);
        this.engineStart.load();
        this.idleEngine = new Audio(`${Settings.ASSETS_FOLDER}/${Settings.SOUND_IDLE_ENGINE}`);
        this.idleEngine.load();
        this.accelerate = new Audio(`${Settings.ASSETS_FOLDER}/${Settings.SOUND_CAR_ACCELERATION}`);
        this.accelerate.load();
        this.hitPothole = new Audio(`${Settings.ASSETS_FOLDER}/${Settings.SOUND_HIT_POTHOLE}`);
        this.acceleratorBonusStart = new Audio(`${Settings.ASSETS_FOLDER}/${Settings.SOUND_ACCELERATOR_BONUS_START}`);
        this.acceleratorBonusStart.load();
        this.acceleratorBonusEnd = new Audio(`${Settings.ASSETS_FOLDER}/${Settings.SOUND_ACCELERATOR_BONUS_END}`);
        this.acceleratorBonusEnd.load();
        this.hitWall = new Audio(`${Settings.ASSETS_FOLDER}/${Settings.SOUND_HIT_WALL}`);
        this.hitWall.load();
    }

    public stopAllAudio(): void {
        this.countdown.pause();
        this.race.pause();
        this.stinger.pause();
        this.themed.pause();
        this.carCarCollision.pause();
        this.engineStart.pause();
        this.idleEngine.pause();
        this.accelerate.pause();
        this.hitWall.pause();
        this.hitPothole.pause();
        this.acceleratorBonusStart.pause();
        this.acceleratorBonusEnd.pause();

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
        this.race.volume = 0.5;
        this.idleEngine.volume = 0.7;
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
            case ObstacleType.Pothole:
                this.startHitPothole();
                this.engineStopAccelerate();
                this.acceleratorBonusStart.pause();
                this.acceleratorBonusStart.currentTime = 0;
                break;
            case ObstacleType.Booster:
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
