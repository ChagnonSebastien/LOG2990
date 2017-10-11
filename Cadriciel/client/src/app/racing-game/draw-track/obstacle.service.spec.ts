import { ObstacleService } from './obstacle.service';
import { AdminModule } from './../../admin/admin.module';
import { TestBed, inject } from '@angular/core/testing';
import * as THREE from 'three';

describe('ObstacleService', () => {
    let service: ObstacleService;
    const track: THREE.Vector2[] = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0, 100),
        new THREE.Vector2(50, 100),
        new THREE.Vector2(100, 50),
        new THREE.Vector2(100, 0)
    ];

    beforeEach(() => {
        service = new ObstacleService();
        service.initialize(track);
    });

    it('should be created', done => {
        expect(service).toBeTruthy();
        done();
    });

    describe('The \'randomSegment\' method', () => {
        it('should return any of the segments but the first one', done => {
            const segment = service.randomSegment();
            expect(segment).toBeGreaterThan(0);
            expect(segment).toBeLessThanOrEqual(4);
            done();
        });
    });

    describe('The \'randomDistance\' method', () => {
        it('should return any number between 0 and 1 if the obstacle is not a booster', done => {
            const segment = service.randomDistance(false);
            expect(segment).toBeGreaterThanOrEqual(0);
            expect(segment).toBeLessThanOrEqual(1);
            done();
        });

        it('should return any number between 0.5 and 1 if the obstacle is a booster', done => {
            const segment = service.randomDistance(true);
            expect(segment).toBeGreaterThanOrEqual(0.5);
            expect(segment).toBeLessThanOrEqual(1);
            done();
        });
    });

});
