import { ObstacleType } from './draw-track/obstacle';
import * as THREE from 'three';

const acceleration = 0.1;
const rotationSpeed = Math.PI / 100;
const maxSpeed = 35;

const boosterObstacleDuration = 60 * 2;
const puddleObstacleDuration = 45;
const potholeObstacleDuration = 30;

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

    public hitObstacle(type: ObstacleType) {
        switch (type) {
            case ObstacleType.Booster:
            this.obstacleEffect = {type, timeLeft: boosterObstacleDuration};
            break;
            case ObstacleType.Pothole:
            this.obstacleEffect = {type, timeLeft: potholeObstacleDuration};
            break;
            case ObstacleType.Puddle:
            this.obstacleEffect = {type, timeLeft: puddleObstacleDuration};
            break;
        }
    }

    public move(vehicle: THREE.Mesh) {
        if (this.moveState === MOVE_STATE.MOVE_FORWARD) {
            if (this.obstacleEffect.timeLeft > 0 && (
                this.obstacleEffect.type === ObstacleType.Puddle || this.obstacleEffect.type === ObstacleType.Pothole
            )) {
                this.brake(vehicle);
            } else {
                this.accelerate(vehicle);
            }
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

        if (this.obstacleEffect.timeLeft > 0) {
            this.obstacleEffect.timeLeft--;
            if (this.obstacleEffect.type === ObstacleType.Pothole) {
                vehicle.position.y = 3 + Math.random() * 25;
            }
        } else  {
            vehicle.position.y = 3;
        }
    }

    public accelerate (object: THREE.Mesh) {
        this.speed = Math.min(maxSpeed, this.speed + acceleration);

        const speedModifier = this.obstacleEffect.timeLeft > 0 && this.obstacleEffect.type === ObstacleType.Booster ? 1.5 : 1;
        object.translateZ(-this.speed * speedModifier);
    }

    public brake (object: THREE.Mesh) {
        if (this.obstacleEffect.timeLeft > 0 && this.obstacleEffect.type === ObstacleType.Booster) {
            // Do not change speed
        } else if (this.speed > 0) {
            const accelerationModifier = this.obstacleEffect.timeLeft > 0 && this.obstacleEffect.type === ObstacleType.Pothole ? 5 : 1;
            this.speed = Math.max(0, this.speed - acceleration * 1.5 * accelerationModifier);
        }

        const speedModifier = this.obstacleEffect.timeLeft > 0 && this.obstacleEffect.type === ObstacleType.Booster ? 1.5 : 1;
        object.translateZ(-this.speed * speedModifier);
    }

    public leftRotation(object: THREE.Mesh) {
        if (this.obstacleEffect.timeLeft > 0 && this.obstacleEffect.type === ObstacleType.Puddle) {
            // Does nothing
        } else {
            object.rotation.y += rotationSpeed;
        }
    }

    public rightRotation(object: THREE.Mesh) {
        if (this.obstacleEffect.timeLeft > 0 && this.obstacleEffect.type === ObstacleType.Puddle) {
            // Does nothing
        } else {
            object.rotation.y -= rotationSpeed;
        }
    }
}
