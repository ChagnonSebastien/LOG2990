import { RaceService } from './events/race.service';
import { CollisionEventService } from './events/collision-event.service';
import { CommandsService } from './events/commands.service';
import { Injectable } from '@angular/core';


@Injectable()
export class AudioService {
    private countdown: HTMLAudioElement;
    private race: HTMLAudioElement;
    private stinger: HTMLAudioElement;
    private themed: HTMLAudioElement;
    private carCarCollision: HTMLAudioElement;
    private engine: HTMLAudioElement;

    constructor(private raceService: RaceService, private collisionEventService: CollisionEventService,
        private commandsService: CommandsService) {
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
        this.engine = new Audio('../../assets/sounds/vrombissement.mp3');
        this.engine.load();
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

    public startEngine() {
        this.engine.play();
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

    private listenForMoveForward() {
        this.commandsService.getCommandKeyUpObservable().subscribe(() => {
            this.startEngine();
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
