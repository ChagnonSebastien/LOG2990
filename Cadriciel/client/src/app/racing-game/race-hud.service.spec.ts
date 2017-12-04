import { VehicleRotateEventService } from './events/vehicle-rotate-event.service';
import { VehicleMovementController } from './vehicle-movement-controller.service';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';
import { CollisionDetectionService } from './collision-detection.service';
import { CountdownService } from './countdown.service';
import { CommandsService } from './events/commands.service';
import { VehicleService } from './vehicle.service';
import { RacingGameService } from './racing-game.service';
import { RaceHudService } from './race-hud.service';
import { TestBed } from '@angular/core/testing';
import { CameraService } from './camera.service';
import { LapCounterService } from './lap-counter.service';
import { LapEventService } from './events/lap-event.service';
import { ObstaclePositionService } from './obstacle-position.service';
import { AudioService } from './audio.service';
import { RoadLimitService } from './road-limit.service';
import { LineCalculationService } from './line-calculation.service';
import { LoadingProgressEventService } from './events/loading-progress-event.service';
import { RaceEventService } from './events/race-event.service';
import { ObstacleCollisionDetectionService } from './obstacle-collision-detection.service';
import { ObstacleCollisionEventService } from './events/obstacle-collision-event.service';
import { CountdownDecreaseEventService } from './events/countdown-decrease-event';
import { ControllerFactory } from './controller-factory.service';

let raceHudService: RaceHudService;

describe('RaceHUDService', function () {

    beforeAll(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [
                RaceHudService,
                CameraService,
                LapCounterService,
                LapEventService,
                RacingGameService,
                VehicleService,
                CommandsService,
                ObstaclePositionService,
                CountdownService,
                AudioService,
                CollisionDetectionService,
                RoadLimitService,
                LineCalculationService,
                VehicleMoveEventService,
                VehicleMovementController,
                VehicleRotateEventService,
                LoadingProgressEventService,
                RaceEventService,
                ObstacleCollisionDetectionService,
                ObstacleCollisionEventService,
                CountdownDecreaseEventService,
                ControllerFactory
            ]
        });
        raceHudService = TestBed.get(RaceHudService);
    });

    it('should be created', () => {
        expect(raceHudService).toBeTruthy();
        expect(raceHudService.timer).toEqual(0.0);
        expect(raceHudService.sceneHud).toBeDefined();
    });

    it('should start timer', () => {
        raceHudService.startTimer();
        expect(raceHudService.lapTimer !== 0);
    });

    it('should reset timer', () => {
        raceHudService['lapCounterService'].racePositions = [0, 0, 0, 0];
        raceHudService.resetLapTimer();
        expect(raceHudService.lapTimer === 0);
    });

    it('should update HUD', () => {
        raceHudService['lapCounterService'].racePositions = [0, 0, 0, 0];
        raceHudService.updateHud(5);
        expect(raceHudService.currentLap === 5);
    });

});
