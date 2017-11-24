import { Obstacle, ObstacleType } from './draw-track/obstacle';
import { Track } from './track';
import { ObstaclePositionService } from './obstacle-position.service';
import { TestBed } from '@angular/core/testing';
import * as THREE from 'three';

let obstacleService: ObstaclePositionService;

describe('ObstacleService', () => {
    beforeAll(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [ObstaclePositionService]
        });
        obstacleService = TestBed.get(ObstaclePositionService);
    });

    it('should be created', () => {
        expect(obstacleService).toBeTruthy();
    });

    describe('initialize()', () => {
        beforeAll(() => {
            obstacleService.initialize(new Track(
                'name',
                'desc',
                'diff',
                [new THREE.Vector2(0, 100), new THREE.Vector2(0, 0), new THREE.Vector2(100, 0)],
                [new Obstacle(ObstacleType.Puddle, 0, 0.5, 1)],
                [],
                [new Obstacle(ObstacleType.Booster, 2, 0, 0.5), new Obstacle(ObstacleType.Booster, 1, 0.5, 0)],
                -1,
                0,
                []
            ));
        });

        it('should initialize the 3 obstacles arrays', () => {
            expect(obstacleService['boosters']).toBeDefined();
            expect(obstacleService['potholes']).toBeDefined();
            expect(obstacleService['puddles']).toBeDefined();
        });

        it('should initialize the right amount of obstacles in each obstacles arrays', () => {
            expect(obstacleService['boosters'].length).toEqual(2);
            expect(obstacleService['potholes'].length).toEqual(0);
            expect(obstacleService['puddles'].length).toEqual(1);
        });

        it('should initialize correctly calculate each absolute obstacle position', () => {
            expect(obstacleService['boosters'][0].x).toEqual(100);
            expect(obstacleService['boosters'][0].y).toEqual(0);
            expect(obstacleService['boosters'][1].x).toEqual(50);
            expect(obstacleService['boosters'][1].y).toEqual(0);
            expect(obstacleService['puddles'][0].x).toEqual(10);
            expect(obstacleService['puddles'][0].y).toEqual(50);
        });
    });

    describe('getObstacles()', () => {

        it('should return the right position array', () => {
            expect(obstacleService.getObstacles(ObstacleType.Booster)).toBe(obstacleService['boosters']);
        });
    });

});
