import { LoadingProgressEventService } from './events/loading-progress-event.service';
import { VehicleColor } from './vehicle-color';
import { TestBed } from '@angular/core/testing';
import { Track } from './track';
import { Vehicle } from './vehicle';
import * as THREE from 'three';
import { ObstacleCollisionEventService } from './events/obstacle-collision-event.service';
import { CommandsService } from './events/commands.service';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';
import { VehicleRotateEventService } from './events/vehicle-rotate-event.service';
import { Controller } from './controller';

const track = new Track('name', 'description', 'type', [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(100, 0),
    new THREE.Vector2(100, 100)
], [], [], [], -1, 0, []);

class MockController extends Controller {
    constructor(moveEventService: VehicleMoveEventService, rotateEventService: VehicleRotateEventService) {
        super(moveEventService, rotateEventService);
    }
}

let vehicle: Vehicle;

describe('Vehicle', () => {
    beforeAll(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [
                ObstacleCollisionEventService,
                CommandsService,
                VehicleMoveEventService,
                VehicleRotateEventService,
                LoadingProgressEventService
            ]
        });
        vehicle = new Vehicle(
            VehicleColor.blue,
            track,
            new MockController(TestBed.get(VehicleMoveEventService), TestBed.get(VehicleRotateEventService)),
            TestBed.get(LoadingProgressEventService)
        );
    });

    it('should be created', () => {
        expect(vehicle).toBeDefined();
    });
});
