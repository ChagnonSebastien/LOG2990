import { HumanController } from './human-controller';
import { VehicleService } from './vehicle.service';
import { SceneService } from './scene.service';
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
        private racingGGameService: RacingGameService,
        private countdownService: CountdownService,
        private collisionDetectionService: CollisionDetectionService,
        private cameraService: CameraService,
        private renderService: RenderService,
        private sceneService: SceneService,
        private vehicleService: VehicleService,
        commandsService: CommandsService,
        countdownDecreaseEventService: CountdownDecreaseEventService,
        loadingProgressEventService: LoadingProgressEventService
    ) {
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
            (event: LoadingProgressEvent) => this.hangleProgressEvent(event)
        );
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
            this.sceneService.toggleNightMode();
            break;
        }
    }

    private handleCountdownDecreaseEvent(event: CountdownDecreaseEvent) {
        this.countdownService.updateCountdown(event.getNewAmount());

        if (event.getNewAmount() === 0) {
            this.racingGGameService.startGame();
            this.countdownService.startGame();
        }
    }

    private hangleProgressEvent(event: LoadingProgressEvent) {
        if (event.getProgress() === 'Vehicle created') {
            const vehicle = <Vehicle> event.getObject();
            this.sceneService.addToScene(vehicle.getVehicle());
            this.collisionDetectionService.generateBoundingBox(vehicle);

            if (vehicle.getColor() === VehicleColor.red) {
                this.cameraService.initializeCameras(vehicle.getVehicle());
            }
        }

        if (event.getProgress() === 'All carts loaded') {
            this.renderService.startRenderingLoop();
        }
    }
}
