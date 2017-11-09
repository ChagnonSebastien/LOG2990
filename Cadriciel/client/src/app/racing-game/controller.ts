import { ObstacleType } from './draw-track/obstacle';
import * as THREE from 'three';

const acceleration = 0.1;
const rotationSpeed = Math.PI / 100;

enum MOVE_STATE { MOVE_FORWARD, BRAKE }
enum TURN_STATE { TURN_LEFT, TURN_RIGHT, DO_NOTHING }

export abstract class Controller {
    public speed: number;

    protected moveState: MOVE_STATE;

    protected turnState: TURN_STATE;

    private obstacleEffect: {type: ObstacleType, timeLeft: number};

    constructor() {
        this.speed = 0;
        this.obstacleEffect = {type: null, timeLeft: 0};
    }

    public move(vehicle: THREE.Mesh) {
        if (this.moveState === MOVE_STATE.MOVE_FORWARD) {
            this.accelerate(vehicle);
        }

        if (this.moveState === MOVE_STATE.BRAKE) {
            this.brake(vehicle);
        }

        if (this.turnState === TURN_STATE.TURN_RIGHT) {
            this.rightRotation(vehicle);
        }

        if (this.turnState === TURN_STATE.TURN_LEFT) {
            this.leftRotation(vehicle);
        }

        if (this.turnState === TURN_STATE.DO_NOTHING) {
            // nothing
        }
    }

    public accelerate (object: THREE.Mesh) {
        this.speed += acceleration;
        object.translateZ(-this.speed);
    }

    public brake (object: THREE.Mesh) {
        if (this.speed > 0) {
            this.speed -= (acceleration * 1.5);
            object.translateZ(-this.speed);
        } else {
            this.speed = 0;
        }
    }

    public leftRotation(object: THREE.Mesh) {
        object.rotation.y += rotationSpeed;
    }

    public rightRotation(object: THREE.Mesh) {
        object.rotation.y -= rotationSpeed;
    }
}
