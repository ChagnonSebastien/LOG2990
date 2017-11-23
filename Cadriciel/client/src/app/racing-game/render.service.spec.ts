import { VehicleMoveEventService } from './events/vehicle-move-event.service';
import { RaceService } from './race.service';
import { AudioService } from './audio.service';
import { CountdownService } from './countdown.service';
import { ObstacleService } from './obstacle.service';
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
                ObstacleService,
                CountdownService,
                AudioService,
                RaceService,
                CollisionDetectionService,
                VehicleMoveEventService,
                RoadLimitService,
                VehicleMovementController,
                VehicleRotateEventService
            ]
        });
        renderService = TestBed.get(RenderService);
    });

    it('Render creation', () => {
        expect(renderService).toBeDefined();
    });

});
