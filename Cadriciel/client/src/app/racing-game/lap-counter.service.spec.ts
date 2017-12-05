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
import { Track } from './track';

import * as THREE from 'three';

let lapCounterService: LapCounterService;
let racingGameService: RacingGameService;

describe('LapCounterService', function () {
    beforeEach(() => {
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
            ]
        });
        lapCounterService = TestBed.get(LapCounterService);
        racingGameService = TestBed.get(RacingGameService);
    });

    it('should be created', () => {
        expect(lapCounterService).toBeTruthy();
    });

    describe('initialize()', () => {
        it('should initialize the lap counter service', () => {
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
            spyOn(racingGameService, 'getTrack')
                .and.returnValue(track);
            lapCounterService.initialize();
            expect(lapCounterService.racePositions).toBeDefined();
            expect(lapCounterService['lastVisitedIntersectionNumbers']).toBeDefined();
            expect(lapCounterService['passedCounters']).toBeDefined();
            expect(lapCounterService['laps']).toBeDefined();
            expect(lapCounterService['numberOfVehicles']).toBeDefined();
            expect(lapCounterService['numberOfIntersections']).toBeDefined();
        });
    });

    describe('update()', () => {
        it('should update the lap counters', () => {
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
            spyOn(racingGameService, 'getTrack')
                .and.returnValue(track);
            lapCounterService.initialize();
            lapCounterService.update();
            lapCounterService['laps'].forEach((lap) => {
                expect(lap).toEqual(0);
            });
        });
    });
});
