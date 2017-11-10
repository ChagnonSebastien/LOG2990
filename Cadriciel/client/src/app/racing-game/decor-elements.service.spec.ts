import { ObstacleService } from './obstacle.service';
import { Track } from './track';
import { LineCalculationService } from './line-calculation.service';
import { DecorElementsService } from './decor-elements.service';
import { TestBed } from '@angular/core/testing';
import * as THREE from 'three';

let decorElementsService: DecorElementsService;
let amountOfTrees;

describe('DecorElementsService', function () {

    beforeAll(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [DecorElementsService, LineCalculationService, ObstacleService]
        });
        decorElementsService = TestBed.get(DecorElementsService);
        decorElementsService.initialize(new THREE.Scene, 1, new Track(
            'name',
            'desc',
            'diff',
            [new THREE.Vector2(0, 100), new THREE.Vector2(0, 0), new THREE.Vector2(100, 0)],
            [],
            [],
            []
        ));
    });

    it('should be created', () => {
        expect(decorElementsService).toBeTruthy();
    });

    describe('addTree()', () => {
        const amountOfTests = 10000;

        it('should not spawn trees above 12', () => {
            for (let i = 0; i < amountOfTests; i++) {
                decorElementsService.addTree(0, Math.random() * 100 + 12, 0);
            }
            expect(decorElementsService['treesPositions'].length).toEqual(0);
        });

        it('should not spawn trees below 0', () => {
            for (let i = 0; i < amountOfTests; i++) {
                decorElementsService.addTree(0, Math.random() * -100, 0);
            }
            expect(decorElementsService['treesPositions'].length).toEqual(0);
        });

        it('should spawn trees about 10% of the time between level 0 and 12', () => {
            for (let i = 0; i < amountOfTests; i++) {
                decorElementsService.addTree(0, Math.random() * 12, 0);
            }
            expect(decorElementsService['treesPositions'].length).toBeLessThan(amountOfTests / 10 * 2);
            expect(decorElementsService['treesPositions'].length).toBeGreaterThan(amountOfTests / 10 / 2);
        });
    });

    describe('placeDecor()', () => {


        beforeAll(async(done) => {
            amountOfTrees = decorElementsService['treesPositions'].length;
            decorElementsService.placeTrees();
            setTimeout(() => {
                done();
            }, 1000);
        });

        it('should spawn the right amount of trees', () => {
            expect((<THREE.Scene>decorElementsService['scene']).children.length).toEqual(amountOfTrees);
        });
    });

    describe('placeDecor()', () => {

        beforeAll(async(done) => {
            decorElementsService.placeDecor();
            setTimeout(() => {
                done();
            }, 1000);
        });

        it('should spawn 100 cones, 10 michel election panels and 10 dylan election panels for a total of 120 objects', () => {
            expect((<THREE.Scene>decorElementsService['scene']).children.length).toEqual(120 + amountOfTrees);
        });
    });
});
