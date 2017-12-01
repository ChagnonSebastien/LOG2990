import { ControllerFactory } from './controller-factory.service';
import { CountdownDecreaseEventService } from './events/countdown-decrease-event';
import { ObstacleCollisionEventService } from './events/obstacle-collision-event.service';
import { ObstacleCollisionDetectionService } from './obstacle-collision-detection.service';
import { LineCalculationService } from './line-calculation.service';
import { AudioService } from './audio.service';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';
import { TestBed, inject } from '@angular/core/testing';

import { CollisionDetectionService } from './collision-detection.service';
import { LoadingProgressEventService } from './events/loading-progress-event.service';
import { VehicleService } from './vehicle.service';
import { CollisionEventService } from './events/collision-event.service';
import { CommandsService } from './events/commands.service';
import { ObstaclePositionService } from './obstacle-position.service';
import { CountdownService } from './countdown.service';
import { RaceEventService } from './events/race-event.service';
import { RoadLimitService } from './road-limit.service';
import { RenderService } from './render.service';
import { CameraService } from './camera.service';
import { VehicleMovementController } from './vehicle-movement-controller.service';
import { VehicleRotateEventService } from './events/vehicle-rotate-event.service';

describe('CollisionDetectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RenderService,
        CameraService,
        CommandsService,
        VehicleService,
        LineCalculationService,
        ObstaclePositionService,
        CountdownService,
        AudioService,
        RaceEventService,
        CollisionDetectionService,
        VehicleMoveEventService,
        RoadLimitService,
        VehicleMovementController,
        VehicleRotateEventService,
        LoadingProgressEventService,
        CollisionEventService,
        ObstacleCollisionDetectionService,
        ObstacleCollisionEventService,
        CountdownDecreaseEventService,
        ControllerFactory
      ]
    });
  });

  it('should be created', inject([CollisionDetectionService], (service: CollisionDetectionService) => {
    expect(service).toBeTruthy();
  }));
});
