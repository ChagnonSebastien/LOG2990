import { ObstacleCollisionEventService } from './events/obstacle-collision-event.service';
import { ObstacleCollisionDetectionService } from './obstacle-collision-detection.service';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';
import { RaceService } from './events/race.service';
import { AudioService } from './audio.service';
import { CountdownService } from './countdown.service';
import { ObstaclePositionService } from './obstacle-position.service';
import { TestBed } from '@angular/core/testing';
import { RenderService } from './render.service';
import { CameraService } from './camera.service';
import { TerrainGenerationService } from './terrain-generation.service';
import { CommandsService } from './events/commands.service';
import { VehicleService } from './vehicle.service';
import { DecorElementsService } from './decor-elements.service';
import { LineCalculationService } from './line-calculation.service';
import { DiamondSquareAlgorithmService } from './diamond-square-algorithm.service';
import { CollisionDetectionService } from './collision-detection.service';
import { RoadLimitService } from './road-limit.service';
import { VehicleMovementController } from './vehicle-movement-controller.service';
import { VehicleRotateEventService } from './events/vehicle-rotate-event.service';
import { LoadingProgressEventService } from './events/loading-progress-event.service';
import { CountdownDecreaseEventService } from './events/countdown-decrease-event';

let renderService: RenderService;

describe('Render', () => {

      beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [
                RenderService,
                CameraService,
                TerrainGenerationService,
                CommandsService,
                VehicleService,
                DecorElementsService,
                LineCalculationService,
                DiamondSquareAlgorithmService,
                ObstaclePositionService,
                CountdownService,
                AudioService,
                RaceService,
                CollisionDetectionService,
                VehicleMoveEventService,
                RoadLimitService,
                VehicleMovementController,
                VehicleRotateEventService,
                LoadingProgressEventService,
                ObstacleCollisionDetectionService,
                ObstacleCollisionEventService,
                CountdownDecreaseEventService
            ]
        });
        renderService = TestBed.get(RenderService);
    });

    it('Render creation', () => {
        expect(renderService).toBeDefined();
    });

});
