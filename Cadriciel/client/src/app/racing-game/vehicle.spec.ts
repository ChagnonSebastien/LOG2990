import { CollisionDetectionService } from './collision-detection.service';
import { ObstacleService } from './obstacle.service';
import { Track } from './track';
import { Vehicle } from './vehicle';
import * as THREE from 'three';

const track = new Track('name', 'description', 'type', [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(100, 0),
    new THREE.Vector2(100, 100)
], [], [], []);

describe('Vehicle', () => {
    const vehicle = new Vehicle(new ObstacleService(), new CollisionDetectionService());

    it('should be created', () => {
        expect(vehicle).toBeDefined();
    });

    it('should return Promise<vehicle> when 3D vehicle created', (done) => {
        vehicle.create3DVehicle(track, 1, 1, null).then(function(vehicle3D) {
            expect(vehicle3D).toBeDefined();
            done();
        });
    });
});
