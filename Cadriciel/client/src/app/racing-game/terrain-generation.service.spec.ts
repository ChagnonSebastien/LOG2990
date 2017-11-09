import { DiamondSquareAlgorithmService } from './diamond-square-algorithm.service';
import { LineCalculationService } from './line-calculation.service';
import { DecorElementsService } from './decor-elements.service';
import { TerrainGenerationService } from './terrain-generation.service';
import { TestBed } from '@angular/core/testing';

let terrainGenerationService;

describe('TerrainGenerationService', function () {

    beforeAll(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [TerrainGenerationService, DecorElementsService, LineCalculationService, DiamondSquareAlgorithmService]
        });
        terrainGenerationService = TestBed.get(TerrainGenerationService);
    });

    it('should be created', () => {
        expect(terrainGenerationService).toBeTruthy();
    });
});
