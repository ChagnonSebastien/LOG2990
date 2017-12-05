import { VehicleColor } from './vehicle-color';
import { ObstacleCollisionEventService } from './events/obstacle-collision-event.service';
import { CommandsService } from './events/commands.service';
import { TestBed } from '@angular/core/testing';
import { CollisionDetectionService } from './collision-detection.service';
import { ObstacleType } from './draw-track/obstacle';
import { Controller, TURN_STATE, MOVE_STATE } from './controller';
import { Vehicle } from './vehicle';
import * as THREE from 'three';
import { VehicleMoveEventService } from './events/vehicle-move-event.service';
import { VehicleRotateEventService } from './events/vehicle-rotate-event.service';
import { LoadingProgressEventService } from './events/loading-progress-event.service';
import { Track } from './track';
import { Vector3 } from 'three';

class MockController extends Controller { }

let controller: Controller;

describe('Controller', function () {
    beforeAll(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [CollisionDetectionService, VehicleMoveEventService, VehicleRotateEventService, CommandsService,
                ObstacleCollisionEventService]
        });
        controller = new MockController(TestBed.get(VehicleMoveEventService), TestBed.get(VehicleRotateEventService));
    });

    it('should be created', () => {
        expect(controller).toBeTruthy();
    });

    describe('hitObstacle()', () => {
        it('should set it\'s active effect to the right type and amount of time', () => {
            controller.hitObstacle(ObstacleType.Booster);
            expect(controller['driveModifier'].constructor.name).toMatch('BoosterModifier');
        });

        it('should overwrite the last activeEffect', () => {
            controller.hitObstacle(ObstacleType.Pothole);
            expect(controller['driveModifier'].constructor.name).toMatch('PotholeModifier');
        });
    });

    describe('move()', () => {

        const track = new Track('name', 'description', 'type', [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(100, 0),
            new THREE.Vector2(100, 100)
        ], [], [], [], -1, 0, []);
        let vehicle: Vehicle;
        beforeEach(() => {
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                providers: [
                    CollisionDetectionService,
                    VehicleMoveEventService,
                    VehicleRotateEventService,
                    CommandsService,
                    ObstacleCollisionEventService,
                    LoadingProgressEventService
                ]
            });
            controller = new MockController(TestBed.get(VehicleMoveEventService), TestBed.get(VehicleRotateEventService));
            vehicle = new Vehicle(
                VehicleColor.blue,
                track,
                controller,
                TestBed.get(LoadingProgressEventService)
            );
            vehicle['vehicleMesh'] = new THREE.Mesh();
            vehicle.getMesh().position.set(0, 0, 0);
        });

        it('should not move the cart if MOVE_STATE = BRAKE and speed = 0', () => {
            controller.nextFrame(vehicle);
            expect(vehicle.getMesh().position.x).toEqual(0);
            expect(vehicle.getMesh().position.y).toEqual(3);
            expect(vehicle.getMesh().position.z).toEqual(0);
        });

        it('should rotate the cart when turning left', () => {
            controller['turnState'] = TURN_STATE.TURN_LEFT;
            controller.nextFrame(vehicle);
            expect(vehicle.getMesh().rotation.y).toBeGreaterThan(0);
        });

        it('should rotate the cart when turning right', () => {
            controller['turnState'] = TURN_STATE.TURN_RIGHT;
            controller.nextFrame(vehicle);
            expect(vehicle.getMesh().rotation.y).toBeLessThan(0);
        });

        it('should move the cartForward and increase speed when MOVE_STATE = FORWARD when the cart rotation is 0', () => {
            controller['moveState'] = MOVE_STATE.MOVE_FORWARD;
            controller.nextFrame(vehicle);
            expect(vehicle.getMesh().position.x).toBeCloseTo(0);
            expect(vehicle.getMesh().position.y).toEqual(3);
            expect(Math.abs(vehicle.getMesh().position.z)).toBeGreaterThan(0);
            expect(controller['linearVelocity'].length()).toBeGreaterThan(0);
        });

        it('should move the cartForward and increase speed when MOVE_STATE = FORWARD when the cart rotation is not 0', () => {
            controller['moveState'] = MOVE_STATE.MOVE_FORWARD;
            vehicle.getMesh().rotation.y = - Math.PI / 2;
            controller.nextFrame(vehicle);
            expect(Math.abs(vehicle.getMesh().position.x)).toBeGreaterThan(0);
            expect(vehicle.getMesh().position.y).toEqual(3);
            expect(vehicle.getMesh().position.z).toBeCloseTo(0);
            expect(controller['linearVelocity'].length()).toBeGreaterThan(0);
        });

        it('should slow the cart down when moveState is brake', () => {
            controller['moveState'] = MOVE_STATE.BRAKE;
            controller['linearVelocity'] = new Vector3(10, 0, 0);
            controller.nextFrame(vehicle);
            expect(Math.abs(vehicle.getMesh().position.x)).toBeLessThan(100);
        });

        it('should not brake the cart when the booster modifier is active and moveState is brake', () => {
            controller['moveState'] = MOVE_STATE.BRAKE;
            controller['linearVelocity'] = new Vector3(0, 0, 10);
            controller.hitObstacle(ObstacleType.Booster);
            controller.nextFrame(vehicle);
            expect(controller['linearVelocity'].length()).toEqual(10);
        });

        it('should brake the cart even if moveState is forward when Pothole Modifier is active', () => {
            controller['moveState'] = MOVE_STATE.MOVE_FORWARD;
            controller['linearVelocity'] = new Vector3(10, 0, 0);
            controller.hitObstacle(ObstacleType.Pothole);
            controller.nextFrame(vehicle);
            expect(controller['linearVelocity'].length()).toBeLessThan(10);
        });

        it('should brake the cart even if moveState is forward when Puddle Modifier is active', () => {
            controller['moveState'] = MOVE_STATE.MOVE_FORWARD;
            controller['linearVelocity'] = new Vector3(10, 0, 0);
            controller.hitObstacle(ObstacleType.Puddle);
            controller.nextFrame(vehicle);
            expect(controller['linearVelocity'].length()).toBeLessThan(10);
        });

        it('should not be able to rotate right when the puddle modifier is active', () => {
            controller['turnState'] = TURN_STATE.TURN_RIGHT;
            controller.hitObstacle(ObstacleType.Puddle);
            controller.nextFrame(vehicle);
            expect(vehicle.getMesh().rotation.y).toEqual(0);
        });

        it('should not be able to rotate left when the puddle modifier is active', () => {
            controller['turnState'] = TURN_STATE.TURN_LEFT;
            controller.hitObstacle(ObstacleType.Puddle);
            controller.nextFrame(vehicle);
            expect(vehicle.getMesh().rotation.y).toEqual(0);
        });
    });
});
