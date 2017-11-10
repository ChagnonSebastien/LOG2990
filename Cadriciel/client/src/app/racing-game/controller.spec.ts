import { ObstacleType } from './draw-track/obstacle';
import { Controller, TURN_STATE, MOVE_STATE } from './controller';
import * as THREE from 'three';

class MockController extends Controller {}

let controller: Controller;

describe('Controller', function () {
    beforeAll(() => {
        controller = new MockController();
    });

    it('should be created', () => {
        expect(controller).toBeTruthy();
    });

    describe('hitObstacle()', () => {
        it('should set it\'s active effect to the right type and amount of time', () => {
            controller.hitObstacle(ObstacleType.Booster);
            expect(controller['obstacleEffect'].type).toBe(ObstacleType.Booster);
            expect(controller['obstacleEffect'].timeLeft).toEqual(120);
        });

        it('should overwrite the last activeEffect', () => {
            controller.hitObstacle(ObstacleType.Pothole);
            expect(controller['obstacleEffect'].type).toBe(ObstacleType.Pothole);
            expect(controller['obstacleEffect'].timeLeft).toEqual(30);
        });
    });

    describe('move()', () => {

        let vehicle: THREE.Mesh;
        beforeEach(() => {
            controller = new MockController();
            vehicle = new THREE.Mesh();
            vehicle.position.set(0, 0, 0);
        });

        it('should not move the cart if MOVE_STATE = BRAKE and speed = 0', () => {
            controller.move(vehicle);
            expect(vehicle.position.x).toEqual(0);
            expect(vehicle.position.y).toEqual(3);
            expect(vehicle.position.z).toEqual(0);
        });

        it('should rotate the cart when turning left', () => {
            controller['turnState'] = TURN_STATE.TURN_LEFT;
            controller.move(vehicle);
            expect(vehicle.rotation.y).toBeGreaterThan(0);
        });

        it('should rotate the cart when turning right', () => {
            controller['turnState'] = TURN_STATE.TURN_RIGHT;
            controller.move(vehicle);
            expect(vehicle.rotation.y).toBeLessThan(0);
        });

        it('should move the cartForward and increase speed when MOVE_STATE = FORWARD when the cart rotation is 0', () => {
            controller['moveState'] = MOVE_STATE.MOVE_FORWARD;
            controller.move(vehicle);
            expect(vehicle.position.x).toBeCloseTo(0);
            expect(vehicle.position.y).toEqual(3);
            expect(Math.abs(vehicle.position.z)).toBeGreaterThan(0);
            expect(controller['speed']).toBeGreaterThan(0);
        });

        it('should move the cartForward and increase speed when MOVE_STATE = FORWARD when the cart rotation is not 0', () => {
            controller['moveState'] = MOVE_STATE.MOVE_FORWARD;
            vehicle.rotation.y = - Math.PI / 2;
            controller.move(vehicle);
            expect(Math.abs(vehicle.position.x)).toBeGreaterThan(0);
            expect(vehicle.position.y).toEqual(3);
            expect(vehicle.position.z).toBeCloseTo(0);
            expect(controller['speed']).toBeGreaterThan(0);
        });

        it('should slow the cart down when moveState is brake', () => {
            controller['moveState'] = MOVE_STATE.BRAKE;
            controller['speed'] = 10;
            controller.move(vehicle);
            expect(Math.abs(vehicle.position.x)).toBeLessThan(100);
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
            expect(vehicle.rotation.y).toEqual(0);
        });

        it('should not be able to rotate left when the puddle modifier is active', () => {
            controller['turnState'] = TURN_STATE.TURN_LEFT;
            controller.hitObstacle(ObstacleType.Puddle);
            controller.move(vehicle);
            expect(vehicle.rotation.y).toEqual(0);
        });
    });
});
