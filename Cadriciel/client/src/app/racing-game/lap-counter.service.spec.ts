import { Track } from './track';
import { ControllerFactory } from './controller-factory.service';
import { CountdownDecreaseEventService } from './events/countdown-decrease-event';
import { ObstacleCollisionEventService } from './events/obstacle-collision-event.service';
import { ObstacleCollisionDetectionService } from './obstacle-collision-detection.service';
import { RaceEventService } from './events/race-event.service';
import { LoadingProgressEventService } from './events/loading-progress-event.service';
import { VehicleRotateEventService } from './events/vehicle-rotate-event.service';
import { VehicleMovementController } from './vehicle-movement-controller.service';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';
import { LineCalculationService } from './line-calculation.service';
import { RoadLimitService } from './road-limit.service';
import { CollisionDetectionService } from './collision-detection.service';
import { AudioService } from './audio.service';
import { CountdownService } from './countdown.service';
import { ObstaclePositionService } from './obstacle-position.service';
import { CommandsService } from './events/commands.service';
import { VehicleService } from './vehicle.service';
import { RacingGameService } from './racing-game.service';
import { LapEventService } from './events/lap-event.service';
import { LapCounterService } from './lap-counter.service';
import { TestBed } from '@angular/core/testing';
import * as THREE from 'three';

let lapCounterService: LapCounterService;

describe('LapCounterService', function () {
    const track = new Track(
        'name',
        'desc',
        'diff',
        [new THREE.Vector2(0, 100), new THREE.Vector2(0, 0), new THREE.Vector2(100, 0)],
        [],
        [],
        [],
        -1,
        0,
        []
    );

    beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [
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
            ]});
        lapCounterService = TestBed.get(LapCounterService);
    });

    it('should be created', () => {
        expect(lapCounterService).toBeTruthy();
    });

});
