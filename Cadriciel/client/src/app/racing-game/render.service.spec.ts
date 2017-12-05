import { RacingSceneService } from './racing-scene.service';
import { FrameEventService } from './events/frame-event.service';
import { SceneService } from './scene.service';
import { ObstacleCollisionEventService } from './events/obstacle-collision-event.service';
import { ObstacleCollisionDetectionService } from './obstacle-collision-detection.service';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';
import { RaceEventService } from './events/race-event.service';
import { AudioService } from './audio.service';
import { CountdownService } from './countdown.service';
import { ObstaclePositionService } from './obstacle-position.service';
import { TestBed } from '@angular/core/testing';
import { RenderService } from './render.service';
import { CameraService } from './camera.service';
import { TerrainGenerationService } from './terrain-generation/terrain-generation.service';
import { CommandsService } from './events/commands.service';
import { VehicleService } from './vehicle.service';
import { DecorElementsService } from './terrain-generation/decor-elements.service';
import { LineCalculationService } from './line-calculation.service';
import { DiamondSquareAlgorithmService } from './terrain-generation/diamond-square-algorithm.service';
import { CollisionDetectionService } from './collision-detection.service';
import { RoadLimitService } from './road-limit.service';
import { VehicleMovementController } from './vehicle-movement-controller.service';
import { VehicleRotateEventService } from './events/vehicle-rotate-event.service';
import { LoadingProgressEventService } from './events/loading-progress-event.service';
import { CountdownDecreaseEventService } from './events/countdown-decrease-event';
import { RaceHudService } from './race-hud.service';
import { LapCounterService } from './lap-counter.service';
import { LapEventService } from './events/lap-event.service';
import { RacingGameService } from './racing-game.service';
import { ControllerFactory } from './controller-factory.service';

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
                RaceEventService,
                CollisionDetectionService,
                VehicleMoveEventService,
                RoadLimitService,
                VehicleMovementController,
                VehicleRotateEventService,
                LoadingProgressEventService,
                ObstacleCollisionDetectionService,
                ObstacleCollisionEventService,
                CountdownDecreaseEventService,
                SceneService,
                FrameEventService,
                RacingSceneService,
                RaceHudService,
                LapCounterService,
                LapEventService,
                RacingGameService,
                ControllerFactory
            ]
        });
        renderService = TestBed.get(RenderService);
    });

    it('Render creation', () => {
        expect(renderService).toBeDefined();
    });

});
