import { ObstacleCollisionEventService } from './events/obstacle-collision-event.service';
import { ObstacleCollisionDetectionService } from './obstacle-collision-detection.service';
import { RaceService } from './events/race.service';
import { LoadingProgressEventService } from './events/loading-progress-event.service';
import { VehicleRotateEventService } from './events/vehicle-rotate-event.service';
import { VehicleMovementController } from './vehicle-movement-controller.service';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';
import { LineCalculationService } from './line-calculation.service';
import { CollisionDetectionService } from './collision-detection.service';
import { AudioService } from './audio.service';
import { CountdownService } from './countdown.service';
import { ObstaclePositionService } from './obstacle-position.service';
import { CommandsService } from './events/commands.service';
import { VehicleService } from './vehicle.service';
import { TestBed } from '@angular/core/testing';
import { RoadLimitService } from './road-limit.service';
import { CountdownDecreaseEventService } from './events/countdown-decrease-event';

let vehicleService: VehicleService;

describe('VehicleService', () => {
    beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [
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
                RaceService,
                ObstacleCollisionDetectionService,
                ObstacleCollisionEventService,
                CountdownDecreaseEventService
            ]
        });
        vehicleService = TestBed.get(VehicleService);
    });

    it('should be created', () => {
        expect(vehicleService).toBeTruthy();
    });

});

