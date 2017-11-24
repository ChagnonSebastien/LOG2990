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

class MockController extends Controller {}

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

        let vehicle: Vehicle;
        beforeEach(() => {
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                providers: [
                    CollisionDetectionService,
                    VehicleMoveEventService,
                    VehicleRotateEventService,
                    CommandsService,
                    ObstacleCollisionEventService
                ]
            });
            controller = new MockController(TestBed.get(VehicleMoveEventService), TestBed.get(VehicleRotateEventService));
            vehicle = new Vehicle(TestBed.get(ObstacleCollisionEventService));
            vehicle['vehicle'] = new THREE.Mesh();
            vehicle.getVehicle().position.set(0, 0, 0);
        });

        it('should not move the cart if MOVE_STATE = BRAKE and speed = 0', () => {
            controller.move(vehicle);
            expect(vehicle.getVehicle().position.x).toEqual(0);
            expect(vehicle.getVehicle().position.y).toEqual(3);
            expect(vehicle.getVehicle().position.z).toEqual(0);
        });

        it('should rotate the cart when turning left', () => {
            controller['turnState'] = TURN_STATE.TURN_LEFT;
            controller.move(vehicle);
            expect(vehicle.getVehicle().rotation.y).toBeGreaterThan(0);
        });

        it('should rotate the cart when turning right', () => {
            controller['turnState'] = TURN_STATE.TURN_RIGHT;
            controller.move(vehicle);
            expect(vehicle.getVehicle().rotation.y).toBeLessThan(0);
        });

        it('should move the cartForward and increase speed when MOVE_STATE = FORWARD when the cart rotation is 0', () => {
            controller['moveState'] = MOVE_STATE.MOVE_FORWARD;
            controller.move(vehicle);
            expect(vehicle.getVehicle().position.x).toBeCloseTo(0);
            expect(vehicle.getVehicle().position.y).toEqual(3);
            expect(Math.abs(vehicle.getVehicle().position.z)).toBeGreaterThan(0);
            expect(controller['speed']).toBeGreaterThan(0);
        });

        it('should move the cartForward and increase speed when MOVE_STATE = FORWARD when the cart rotation is not 0', () => {
            controller['moveState'] = MOVE_STATE.MOVE_FORWARD;
            vehicle.getVehicle().rotation.y = - Math.PI / 2;
            controller.move(vehicle);
            expect(Math.abs(vehicle.getVehicle().position.x)).toBeGreaterThan(0);
            expect(vehicle.getVehicle().position.y).toEqual(3);
            expect(vehicle.getVehicle().position.z).toBeCloseTo(0);
            expect(controller['speed']).toBeGreaterThan(0);
        });

        it('should slow the cart down when moveState is brake', () => {
            controller['moveState'] = MOVE_STATE.BRAKE;
            controller['speed'] = 10;
            controller.move(vehicle);
            expect(Math.abs(vehicle.getVehicle().position.x)).toBeLessThan(100);
        });

        it('should not brake the cart when the booster modifier is active and moveState is brake', () => {
            controller['moveState'] = MOVE_STATE.BRAKE;
            controller['speed'] = 10;
            controller.hitObstacle(ObstacleType.Booster);
            controller.move(vehicle);
            expect(controller['speed']).toEqual(10);
        });

        it('should brake the cart even if moveState is forward when Pothole Modifier is active', () => {
            controller['moveState'] = MOVE_STATE.MOVE_FORWARD;
            controller['speed'] = 10;
            controller.hitObstacle(ObstacleType.Pothole);
            controller.move(vehicle);
            expect(controller['speed']).toBeLessThan(10);
        });

        it('should brake the cart even if moveState is forward when Puddle Modifier is active', () => {
            controller['moveState'] = MOVE_STATE.MOVE_FORWARD;
            controller['speed'] = 10;
            controller.hitObstacle(ObstacleType.Puddle);
            controller.move(vehicle);
            expect(controller['speed']).toBeLessThan(10);
        });

        it('should not be able to rotate right when the puddle modifier is active', () => {
            controller['turnState'] = TURN_STATE.TURN_RIGHT;
            controller.hitObstacle(ObstacleType.Puddle);
            controller.move(vehicle);
            expect(vehicle.getVehicle().rotation.y).toEqual(0);
        });

        it('should not be able to rotate left when the puddle modifier is active', () => {
            controller['turnState'] = TURN_STATE.TURN_LEFT;
            controller.hitObstacle(ObstacleType.Puddle);
            controller.move(vehicle);
            expect(vehicle.getVehicle().rotation.y).toEqual(0);
        });
    });
});
