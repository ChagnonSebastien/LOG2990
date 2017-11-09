import { TestBed } from '@angular/core/testing';
import { RenderService } from './render.service';
import { CameraService } from './camera.service';
import { TerrainGenerationService } from './terrain-generation.service';
import { CommandsService } from './commands.service';
import { VehicleService } from './vehicle.service';
import { DecorElementsService } from './decor-elements.service';
import { LineCalculationService } from './line-calculation.service';
import { DiamondSquareAlgorithmService } from './diamond-square-algorithm.service';

let renderService: RenderService;

describe('Render', () => {

      beforeEach(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [RenderService, CameraService, TerrainGenerationService, CommandsService,
                        VehicleService, DecorElementsService, LineCalculationService, DiamondSquareAlgorithmService]
        });
        renderService = TestBed.get(RenderService);
    });

    it('Render creation', () => {
        expect(renderService).toBeDefined();
    });

});
