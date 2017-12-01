import { RaceService } from './events/race.service';
import { CollisionEventService } from './events/collision-event.service';
import { CommandsService } from './events/commands.service';
import { PlayerCommand } from './events/commands.service';
import { Injectable } from '@angular/core';


@Injectable()
export class AudioService {
    private countdown: HTMLAudioElement;
    private race: HTMLAudioElement;
    private stinger: HTMLAudioElement;
    private themed: HTMLAudioElement;
    private carCarCollision: HTMLAudioElement;
    private engineStart: HTMLAudioElement[] = [];
    private idleEngine: HTMLAudioElement;
    private accelerate: HTMLAudioElement;
    private hitWall: HTMLAudioElement;
    private hitPothole: HTMLAudioElement;
    private acceleratorBonusStart: HTMLAudioElement;
    private acceleratorBonusEnd: HTMLAudioElement;

    constructor(private raceService: RaceService, private collisionEventService: CollisionEventService,
        private commandsService: CommandsService) {
        this.listenForEndOfRace();
        this.listenForCarCarCollision();
        this.listenForMoveVehicle();
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
        for (let i = 0; i < 4; i++) {
            this.engineStart[i] = new Audio('../../assets/sounds/carStart.mp3');
            this.engineStart[i].load();
        }
        this.idleEngine = new Audio('../../assets/sounds/idleEngine.mp3');
        this.idleEngine.load();
        this.accelerate = new Audio('../../assets/sounds/carAcceleration.mp3');
    }

    public startCountdown(): void {
        this.countdown.play();
        for (let i = 0; i < 4; i++) {
            this.engineStart[i].play();
        }
        this.countdown.addEventListener('ended', () => {
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

    private startCarCarCollision(): void {
        this.engineStopAcccelerate();
        this.carCarCollision.play();
    }

    private engineAccelerate(): void {
        this.accelerate.loop = true;
        this.accelerate.play();
    }

    private engineStopAcccelerate(): void {
        console.log('stop');
        this.accelerate.pause();
        this.accelerate.currentTime = 0;
    }

    private listenForEndOfRace(): void {
        this.raceService.raceEndedAlerts().subscribe(() => {
            this.stopRace();
            this.startStinger();
        });
    }

    private listenForCarCarCollision(): void {
        this.collisionEventService.getCollisionObservable().subscribe(() => {
            this.startCarCarCollision();
        });
    }

    private listenForMoveVehicle(): void {
        this.commandsService.getCommandKeyDownObservable().subscribe((event) => {
            if (event.getCommand() === PlayerCommand.MOVE_FORWARD) {
                this.engineAccelerate();
            }
        });
    }
    private listenForStopMoveVehicle(): void {
        this.commandsService.getCommandKeyUpObservable().subscribe((event) => {
            if (event.getCommand() === PlayerCommand.MOVE_FORWARD) {
                this.engineStopAcccelerate();
            }
        });
    }
    private startStinger(): void {
        this.stinger.play();
        this.stinger.addEventListener('ended', () => {
            this.startThemed();
        });
    }

    private startThemed(): void {
        this.themed.loop = true;
        this.themed.play();
    }
}
