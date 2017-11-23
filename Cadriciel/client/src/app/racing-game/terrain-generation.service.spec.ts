import { ObstacleService } from './obstacle.service';
import { Track } from './track';
import { DiamondSquareAlgorithmService } from './diamond-square-algorithm.service';
import { LineCalculationService } from './line-calculation.service';
import { DecorElementsService } from './decor-elements.service';
import { TerrainGenerationService } from './terrain-generation.service';
import { TestBed } from '@angular/core/testing';
import * as THREE from 'three';

let terrainGenerationService: TerrainGenerationService;

document.getElementById = jasmine.createSpy('HTML Element').and.callFake(function(ID) {
   return document.createElement('div');
});

describe('TerrainGenerationService', function () {

    beforeAll(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [
                TerrainGenerationService,
                DecorElementsService,
                LineCalculationService,
                DiamondSquareAlgorithmService,
                ObstacleService
            ]
        });
        terrainGenerationService = TestBed.get(TerrainGenerationService);
    });

    it('should be created', () => {
        expect(terrainGenerationService).toBeTruthy();
    });

    it('should generate the heightTable upon creation', () => {
        expect(terrainGenerationService['heightTable']).toBeDefined();
    });

    describe('generate()', function () {

        beforeAll(async(done) => {
            terrainGenerationService.generate(new THREE.Scene, 1, new Track(
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
            ), new THREE.Texture());

            setTimeout(() => {
                done();
            }, 2000);
        });

        it( 'should calculate the width of the map', () => {
            expect((terrainGenerationService['mapWidth'])).toEqual(400);
        });

        it( 'should pupulate the scene with 1 terrain, 1 water body, 120 decorations, 3 intersections, ' +
            '3 segments, the start plaid and a unknown number of trees', () => {
            expect((<THREE.Scene>terrainGenerationService['scene']).children.length).toBeGreaterThan(128);
        });
    });
});
