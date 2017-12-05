import { Settings } from './settings';
import { RaceHudService } from './race-hud.service';
import { RaceEventService, RaceEndedEvent } from './events/race-event.service';
import { LapEventService, LapEvent } from './events/lap-event.service';
import { LapCounterService } from './lap-counter.service';
import { ObstaclePositionService } from './obstacle-position.service';
import { Track } from './track';
import { RacingSceneService } from './racing-scene.service';
import { FrameEvent, FrameEventService } from './events/frame-event.service';
import { ObstacleCollisionEventService, ObstacleCollisionEvent } from './events/obstacle-collision-event.service';
import { CollisionEventService, CollisionEvent } from './events/collision-event.service';
import { VehicleRotateEvent, VehicleRotateEventService } from './events/vehicle-rotate-event.service';
import { VehicleMovementController } from './vehicle-movement-controller.service';
import { RoadLimitService } from './road-limit.service';
import { ObstacleCollisionDetectionService } from './obstacle-collision-detection.service';
import { VehicleMoveEventService, VehicleMoveEvent } from './events/vehicle-move-event.service';
import { HumanController } from './human-controller';
import { VehicleService } from './vehicle.service';
import { RenderService } from './render.service';
import { VehicleColor } from './vehicle-color';
import { CameraService } from './camera.service';
import { CollisionDetectionService } from './collision-detection.service';
import { LoadingProgressEventService, LoadingProgressEvent } from './events/loading-progress-event.service';
import { CommandsService, CommandEvent, PlayerCommand } from './events/commands.service';
import { CountdownDecreaseEventService, CountdownDecreaseEvent } from './events/countdown-decrease-event';
import { Injectable } from '@angular/core';
import { CountdownService } from './countdown.service';
import { RacingGameService } from './racing-game.service';
import { AudioService } from './audio.service';
import { HitWallEventService, HitWallEvent } from './events/hit-wall-event.service';
import { Vehicle } from './vehicle';


@Injectable()
export class RaceMediator {

    constructor(
        private racingGameService: RacingGameService,
        private countdownService: CountdownService,
        private collisionDetectionService: CollisionDetectionService,
        private obstacleCollisionDetectionService: ObstacleCollisionDetectionService,
        private cameraService: CameraService,
        private renderService: RenderService,
        private racingSceneService: RacingSceneService,
        private vehicleService: VehicleService,
        private roadLimitService: RoadLimitService,
        private vehicleMovementController: VehicleMovementController,
        private obstaclePositionService: ObstaclePositionService,
        private lapcounterService: LapCounterService,
        private raceEventService: RaceEventService,
        private raceService: RaceHudService,
        private audioService: AudioService,
        private hitWallEventService: HitWallEventService,
        private commandsService: CommandsService,
        private frameEventService: FrameEventService,
        private countdownDecreaseEventService: CountdownDecreaseEventService,
        private loadingProgressEventService: LoadingProgressEventService,
        private vehicleMoveEventService: VehicleMoveEventService,
        private vehicleRotateEventService: VehicleRotateEventService,
        private obstacleCollisionEventService: ObstacleCollisionEventService,
        private collisionEventService: CollisionEventService,
        private lapEventService: LapEventService,
    ) {
        frameEventService.getFrameObservable().subscribe(
            (event: FrameEvent) => this.handleFrameEvent(event)
        );

        countdownDecreaseEventService.getCountdownDecreaseObservable().subscribe(
            (event: CountdownDecreaseEvent) => this.handleCountdownDecreaseEvent(event)
        );

        commandsService.getCommandKeyUpObservable().subscribe(
            (event: CommandEvent) => this.handleKeyUpEvent(event)
        );

        commandsService.getCommandKeyDownObservable().subscribe(
            (event: CommandEvent) => this.handleKeyDownEvent(event)
        );

        loadingProgressEventService.getLoadingObservable().subscribe(
            (event: LoadingProgressEvent) => this.handleProgressEvent(event)
        );

        vehicleMoveEventService.getVehicleMoveObservable().subscribe(
            (event: VehicleMoveEvent) => this.handleMoveEvent(event)
        );

        vehicleRotateEventService.getVehicleRotateObservable().subscribe(
            (event: VehicleRotateEvent) => this.handleRotateEvent(event)
        );

        obstacleCollisionEventService.getObstacleCollisionObservable().subscribe(
            (event: ObstacleCollisionEvent) => this.handleObstacleCollisionEvent(event)
        );

        collisionEventService.getCollisionObservable().subscribe(
            (event: CollisionEvent) => this.handleCollisionEvent(event)
        );

        lapEventService.getLapObservable().subscribe(
            (event: LapEvent) => this.handleLapEvent(event)
        );

        raceEventService.raceEndedAlerts().subscribe(
            (event: RaceEndedEvent) => this.handleRaceEndedEvent(event)
        );

        this.hitWallEventService.getHitWallObservable().subscribe(
            (event: HitWallEvent) => this.handleHitWallEvent(event)
        );
    }

    public startProgram(container: HTMLElement, track: Track): void {
        this.racingGameService.initialize(track);
        this.cameraService.initialize(container);
        this.renderService.initialize(container, track);
        this.vehicleService.createVehicles(track);
        this.obstaclePositionService.initialize(track);
        this.lapcounterService.initialize();
    }

    private handleFrameEvent(event: FrameEvent): void {
        this.cameraService.cameraOnMoveWithObject();
        this.vehicleService.getVehicles().forEach((vehicle: Vehicle) => {
            vehicle.getController().nextFrame(vehicle);
        });
        if (this.vehicleService.getVehicles() !== undefined) {
            this.lapcounterService.update();
        }

    }

    private handleKeyUpEvent(event: CommandEvent): void {
        switch (event.getCommand()) {
            case PlayerCommand.MOVE_FORWARD:
                this.audioService.engineStopAccelerate();
            // falls through
            case PlayerCommand.ROTATE_LEFT:
            case PlayerCommand.ROTATE_RIGHT:
                (<HumanController>this.vehicleService.getMainVehicle().getController()).endDirective(event.getCommand());
                break;
        }
    }

    private handleKeyDownEvent(event: CommandEvent): void {

        switch (event.getCommand()) {
            case PlayerCommand.MOVE_FORWARD:
                this.audioService.engineAccelerate();
            // falls through
            case PlayerCommand.ROTATE_LEFT:
            case PlayerCommand.ROTATE_RIGHT:
                (<HumanController>this.vehicleService.getMainVehicle().getController()).startDirective(event.getCommand());
                break;

            case PlayerCommand.START_GAME:
                this.countdownService.startCountdown();
                break;

            case PlayerCommand.ZOOM_IN:
                this.cameraService.zoomIn();
                break;

            case PlayerCommand.ZOOM_OUT:
                this.cameraService.zoomOut();
                break;

            case PlayerCommand.TOOGLE_CAMERA_VIEW:
                this.cameraService.toggleCamera();
                break;

            case PlayerCommand.TOGGLE_NIGHT_MODE:
                this.racingSceneService.toggleNightMode();
                break;

            case PlayerCommand.REAR_VISIBLE:
                this.renderService.swapRearWiew();
                break;
        }
    }

    private handleCountdownDecreaseEvent(event: CountdownDecreaseEvent): void {
        this.countdownService.updateCountdown(event.getNewAmount());

        if (event.getNewAmount() === 0) {
            this.racingSceneService.removeObjectByName('countdown');
            this.countdownService.startGame();
            this.raceService.startTimer();
        }
    }

    private handleProgressEvent(event: LoadingProgressEvent): void {
        if (event.getProgress() === 'Vehicle created') {
            this.vehicleService.vehicleCreated();
            const vehicle = <Vehicle>event.getObject();
            this.racingSceneService.light.addLightsToVehicle(vehicle.getMesh());
            this.racingSceneService.light.hideLightsVehicle();
            this.racingSceneService.addObject(vehicle.getMesh());
            this.collisionDetectionService.generateBoundingBox(vehicle);

            if (vehicle.getColor() === VehicleColor.red) {
                this.cameraService.initializeCameras(vehicle.getMesh());
            }
        }

        if (event.getProgress() === 'All carts loaded') {
            this.countdownService.createCountdown(this.racingGameService.getTrack());
            this.renderService.startRenderingLoop();
        }
    }

    private handleMoveEvent(event: VehicleMoveEvent): void {
        this.obstacleCollisionDetectionService.detectCollision(event);
        this.roadLimitService.validateMovement(event);
        this.vehicleMovementController.validateMovement(event);
        this.collisionDetectionService.checkForCollisionWithCar(event);
    }

    private handleRotateEvent(event: VehicleRotateEvent): void {
        this.vehicleMovementController.validateRotation(event);
    }

    private handleObstacleCollisionEvent(event: ObstacleCollisionEvent) {
        event.getVehicle().getController().hitObstacle(event.getObstacle());
        this.audioService.handleObstacleCollision(event.getObstacle());
    }

    private handleCollisionEvent(event: CollisionEvent): void {
        this.audioService.startCarCarCollision();
        this.audioService.engineStopAccelerate();
    }

    private handleLapEvent(event: LapEvent): void {
        if (event.lap === Settings.TOTAL_LAPS) {
            this.raceEventService.endRace();
        }
        this.raceService.resetLapTimer();
        this.raceService.updateHud(event.lap);
    }

    private handleRaceEndedEvent(event: RaceEndedEvent): void {
        this.raceService.stopTimers();
        this.audioService.stopRace();
        this.audioService.startStinger();
        this.ghostMode();
    }

    private handleHitWallEvent(event: HitWallEvent): void {
        this.audioService.carHitWall();
        this.audioService.engineStopAccelerate();
    }

    private ghostMode(): void {
        this.vehicleMoveEventService.eventListener.unsubscribe();
        this.vehicleRotateEventService.eventListener.unsubscribe();
        this.obstacleCollisionEventService.eventListener.unsubscribe();
        this.collisionEventService.eventListener.unsubscribe();
        this.vehicleService.getMainVehicle().getMesh().material.transparent = true;
        this.vehicleService.getMainVehicle().getMesh().material.opacity = Settings.END_RACE_CAR_TRANSPARENCY;
    }

}
