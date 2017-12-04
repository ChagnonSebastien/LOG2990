import { TestBed, inject } from '@angular/core/testing';
import { CollisionResolveService } from './collision-resolve.service';
import { CollisionEventService, CollisionEvent } from './events/collision-event.service';
import { Vehicle } from './vehicle';
import * as THREE from 'three';


class MockController  {
    private angularVelocity: THREE.Vector3;
    private linearVelocity: THREE.Vector3;
}

class MockVehicle  {
    
    private controller: MockController;
    private vehicle: THREE.Vector3;

}

describe('CollisionResolveService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CollisionResolveService]
        });
    });

    it('should be created', inject([CollisionResolveService], (service: CollisionResolveService) => {
        expect(service).toBeTruthy();
    }));

    it('should correctly set the final velocities and position', inject([CollisionResolveService], (service: CollisionResolveService) => {
      const vehicle = new MockVehicle;
        (service as any).handleVehicleSpeeds(MockVehicle as Vehicle)
    }));
});
