import { TestBed, inject } from '@angular/core/testing';
import { CollisionResolveService } from './collision-resolve.service';
import { CollisionEventService, CollisionEvent } from './events/collision-event.service';
import { Vehicle } from './vehicle';
import * as THREE from 'three';

describe('CollisionResolveService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CollisionResolveService]
        });
    });

    it('should be created', inject([CollisionResolveService], (service: CollisionResolveService) => {
        expect(service).toBeTruthy();
    }));

    it('should correctly compute the norm', inject([CollisionResolveService], (service: CollisionResolveService) => {
        const testPositionA = new THREE.Vector3(0 , 3 , 0);
        const testPositionB = new THREE.Vector3(8 , 3 , 8);
        const distance = testPositionA.distanceTo(testPositionB);
        const normX = (service as any).computeNorm(testPositionA.x, testPositionB.x, distance);
        const normZ = (service as any).computeNorm(testPositionA.z, testPositionB.z, distance);
        const expectedNormX = 0.7073;
        const expectedNormZ = 0.7073;
        expect(normX).toBeCloseTo(expectedNormX);
        expect(normX).toBeCloseTo(expectedNormZ);
    }));

    it('should correctly calculate the relation factor', inject([CollisionResolveService], (service: CollisionResolveService) => {
        const testPositionA = new THREE.Vector3(0 , 0 , 0);
        const testPositionB = new THREE.Vector3(8 , 0 , 8);
        const distance = testPositionA.distanceTo(testPositionB);
        const normX = (service as any).computeNorm(testPositionA.x, testPositionB.x, distance);
        const normZ = (service as any).computeNorm(testPositionA.z, testPositionB.z, distance);
        const velocityA = new THREE.Vector3(1 , 0 , 3);
        const velocityB = new THREE.Vector3(0 , 0 , 0);
        const relationFactor = (service as any).calculateRelationFactor(velocityA, velocityB, normX, normZ);
        const expectedRelationFactor = 0.5656;
        expect(relationFactor).toBeCloseTo(expectedRelationFactor);
     }));
});
