import { CollisionResolveService } from './collision-resolve.service';
import { RaceService, RaceEndedEvent } from './events/race.service';
import { LapEventService, LapEvent } from './events/lap-event.service';
import { LapCounterService } from './lap-counter.service';
import { ObstaclePositionService } from './obstacle-position.service';
import { Track } from './track';
import { RacingSceneService } from './racing-scene.service';
import { FrameEvent, FrameEventService } from './events/frame-event.service';
import { ObstacleCollisionEventService, ObstacleCollisionEvent } from './events/obstacle-collision-event.service';
import { CollisionEventService, CollisionEvent } from './events/collision-event.service';
import { CollisionResolvedEventService, CollisionResolvedEvent } from './events/collision-resolved-event.service';
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
        private raceService: RaceService,
        private collisionResolveService: CollisionResolveService,
        commandsService: CommandsService,
        frameEventService: FrameEventService,
        countdownDecreaseEventService: CountdownDecreaseEventService,
        loadingProgressEventService: LoadingProgressEventService,
        vehicleMoveEventService: VehicleMoveEventService,
        vehicleRotateEventService: VehicleRotateEventService,
        obstacleCollisionEventService: ObstacleCollisionEventService,
        collisionEventService: CollisionEventService,
        collisionResolvedEventService: CollisionResolvedEventService,
        lapEventService: LapEventService,
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

        raceService.raceEndedAlerts().subscribe(
            (event: RaceEndedEvent) => this.handleRaceEndedEvent(event)
        );

        collisionResolvedEventService.getCollisionResolvedObservable().subscribe(
            (event: CollisionEvent) => this.handleCollisionResolvedEvent(event)
        );
    }

    public startProgram(container: HTMLElement, track: Track) {
        this.racingGameService.initialize(track);
        this.cameraService.initialize(container);
        this.renderService.initialize(container, track);
        this.vehicleService.createVehicles(track);
        this.countdownService.createCountdown(track);
        this.obstaclePositionService.initialize(track);
        this.lapcounterService.initializePassedCounter();
    }

    private handleFrameEvent(event: FrameEvent) {
        this.cameraService.cameraOnMoveWithObject();
        this.vehicleService.getVehicles().forEach((vehicle: Vehicle) => {
            vehicle.getController().nextFrame(vehicle);
        });
        if (this.vehicleService.getVehicles() !== undefined) {
            this.lapcounterService.updateLapCounter();
        }
    }

    private handleKeyUpEvent(event: CommandEvent) {
        switch (event.getCommand()) {
            case PlayerCommand.MOVE_FORWARD:
            case PlayerCommand.ROTATE_LEFT:
            case PlayerCommand.ROTATE_RIGHT:
            (<HumanController> this.vehicleService.getMainVehicle().getController()).endDirective(event.getCommand());
            break;
        }
    }

    private handleKeyDownEvent(event: CommandEvent) {

        switch (event.getCommand()) {
            case PlayerCommand.MOVE_FORWARD:
            case PlayerCommand.ROTATE_LEFT:
            case PlayerCommand.ROTATE_RIGHT:
            (<HumanController> this.vehicleService.getMainVehicle().getController()).startDirective(event.getCommand());
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
        }
    }

    private handleCountdownDecreaseEvent(event: CountdownDecreaseEvent) {
        this.countdownService.updateCountdown(event.getNewAmount());

        if (event.getNewAmount() === 0) {
            this.racingSceneService.removeObjectByName('countdown');
            this.countdownService.startGame();
        }
    }

    private handleProgressEvent(event: LoadingProgressEvent) {
        if (event.getProgress() === 'Vehicle created') {
            this.vehicleService.vehicleCreated();
            const vehicle = <Vehicle> event.getObject();
            this.racingSceneService.addObject(vehicle.getVehicle());
            this.collisionDetectionService.generateBoundingBox(vehicle);

            if (vehicle.getColor() === VehicleColor.red) {
                this.cameraService.initializeCameras(vehicle.getVehicle());
            }
        }

        if (event.getProgress() === 'All carts loaded') {
            this.renderService.startRenderingLoop();
        }
    }

    private handleMoveEvent(event: VehicleMoveEvent) {
        this.obstacleCollisionDetectionService.detectCollision(event);
        this.roadLimitService.validateMovement(event);
        this.vehicleMovementController.validateMovement(event);
        this.collisionDetectionService.checkForCollisionWithCar(event);
    }

    private handleRotateEvent(event: VehicleRotateEvent) {
        this.vehicleMovementController.validateRotation(event);
    }

    private handleObstacleCollisionEvent(event: ObstacleCollisionEvent) {
        event.getVehicle().getController().hitObstacle(event.getObstacle());
    }

    private handleCollisionEvent(event: CollisionEvent) {
        this.collisionResolveService.resolveCollision(event);
    }

    private handleLapEvent(event: LapEvent) {
        if (event.lap === 3) {
            console.log('Race ends');
            this.raceService.endRace();
        }
        console.log('LAP: ', event.lap);
    }

    private handleRaceEndedEvent(event: RaceEndedEvent) {
        console.log('race ended');
    }

    private handleCollisionResolvedEvent(event: CollisionResolvedEvent) {
        this.collisionDetectionService.setCollisionAsResolved();
    }
}
