import { TestBed, inject } from '@angular/core/testing';
import { CollisionResolveService } from './collision-resolve.service';
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

  it('should calculate the distance vector', inject([CollisionResolveService], (service: CollisionResolveService) => {
    const distanceVector = service.calculateDistanceVector(2, 2, 4, 5);
    const result = new THREE.Vector3(2, 0, 3);
    expect(distanceVector).toEqual(result);
  }));

  it('should calculate the normal', inject([CollisionResolveService], (service: CollisionResolveService) => {
    const normal = service.calculateNormal(5, 5, 9, 2);
    const result = new THREE.Vector3(3, 0, 4);
    expect(normal).toEqual(result);
  }));

  it('should calculate normal in the correct direction', inject([CollisionResolveService], (service: CollisionResolveService) => {
    const normalExpected = new THREE.Vector3(-3 / 5, 0, -4 / 5);
    const normal = new THREE.Vector3(3, 0, 4);
    service.getCorrectNormalDirection(normal, 3, 2, 11, 3);
    expect(normal.x).toBeCloseTo(normalExpected.x);
    expect(normal.y).toBeCloseTo(normalExpected.y);
    expect(normal.z).toBeCloseTo(normalExpected.z);
  }));
});
