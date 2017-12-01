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
    service.setCorrectNormalDirection(normal, 3, 2, 11, 3);
    expect(normal.x).toBeCloseTo(normalExpected.x);
    expect(normal.y).toBeCloseTo(normalExpected.y);
    expect(normal.z).toBeCloseTo(normalExpected.z);
  }));

  it('should calculate the moment of inertia of a 2d plane', inject([CollisionResolveService], (service: CollisionResolveService) => {
    const inertia = service.calculateMomentOfInertia(4, 3, true);
    const expected = -10.416;
    expect(inertia).toBeCloseTo(expected);
  }));

  it('should calculate impulse factor', inject([CollisionResolveService], (service: CollisionResolveService) => {
    const normal = new THREE.Vector3(-2 / Math.sqrt(5), 0, -1 / Math.sqrt(5));
    const distanceA = new THREE.Vector3(3, 0, -1);
    const distanceB = new THREE.Vector3(-2, 0, -4);
    const inertiaA = 56.67;
    const inertiaB = -56.67;
    const relativeVelocity = new THREE.Vector3(5, 0, -5);
    const impulse = service.calculateImpulse(1, normal, distanceA, distanceB, inertiaA, inertiaB, relativeVelocity);
    const expected = 12.38;
    expect(impulse).toBeCloseTo(expected);
  }));
});
