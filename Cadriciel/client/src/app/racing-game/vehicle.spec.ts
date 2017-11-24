import { TestBed } from '@angular/core/testing';
import { Track } from './track';
import { Vehicle } from './vehicle';
import * as THREE from 'three';
import { ObstacleCollisionEventService } from './events/obstacle-collision-event.service';

const track = new Track('name', 'description', 'type', [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(100, 0),
    new THREE.Vector2(100, 100)
], [], [], [], -1, 0, []);

let vehicle: Vehicle;

describe('Vehicle', () => {
    beforeAll(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [
                ObstacleCollisionEventService
            ]
        });
        vehicle = new Vehicle(TestBed.get(ObstacleCollisionEventService));
    });

    it('should be created', () => {
        expect(vehicle).toBeDefined();
    });

    it('should return Promise<vehicle> when 3D vehicle created', (done) => {
        vehicle.create3DVehicle(track, 1, null).then(function(vehicle3D) {
            expect(vehicle3D).toBeDefined();
            done();
        });
    });
});
