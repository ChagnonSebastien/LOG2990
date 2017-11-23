import { VehicleRotateEventService, VehicleRotateEvent } from './events/vehicle-rotate-event.service';
import { VehicleMoveEventService, VehicleMoveEvent } from './events/vehicle-move-event.service';
import { ObstacleType } from './draw-track/obstacle';
import { Vector3 } from 'three';
import { Vehicle } from './vehicle';
const acceleration = 0.1;
const rotationSpeed = Math.PI / 100;
const maxSpeed = 35;

const boosterObstacleDuration = 60 * 2;
const puddleObstacleDuration = 45;
const potholeObstacleDuration = 30;

export enum MOVE_STATE { MOVE_FORWARD, BRAKE }
export enum TURN_STATE { TURN_LEFT, TURN_RIGHT, DO_NOTHING }

export abstract class Controller {
    public speed: number;

    protected moveState: MOVE_STATE;

    protected turnState: TURN_STATE;

    private obstacleEffect: {type: ObstacleType, timeLeft: number};

    constructor(
        protected vehicleMoveEventService: VehicleMoveEventService,
        protected vehicleRotateEventService: VehicleRotateEventService
    ) {
        this.speed = 0;
        this.obstacleEffect = {type: null, timeLeft: 0};
        this.moveState = MOVE_STATE.BRAKE;
        this.turnState = TURN_STATE.DO_NOTHING;
    }

    public hitWall(speedModifier: number) {
        this.speed = Math.min(maxSpeed * speedModifier, this.speed * 0.98 * speedModifier);
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

    public move(vehicle: Vehicle) {
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
                vehicle.getVehicle().position.y = 3 + Math.random() * 25;
            }
        } else  {
            vehicle.getVehicle().position.y = 3;
        }
    }

    private accelerate (object: Vehicle) {
        this.speed = Math.min(maxSpeed, this.speed + acceleration);

        const speedModifier = this.obstacleEffect.timeLeft > 0 && this.obstacleEffect.type === ObstacleType.Booster ? 1.5 : 1;
        const newPosition = new Vector3 (
            object.getVehicle().position.x - Math.sin(object.getVehicle().rotation.y) * speedModifier * this.speed,
            0,
            object.getVehicle().position.z - Math.cos(object.getVehicle().rotation.y) * speedModifier * this.speed
        );

        const moveEvent = new VehicleMoveEvent(object.getVehicle().position, newPosition, object);
        this.vehicleMoveEventService.sendVehicleMoveEvent(moveEvent);
        if (!moveEvent.isCancelled()) {
            object.getVehicle().position.x = newPosition.x;
            object.getVehicle().position.z = newPosition.z;
        }
    }

    private brake (object: Vehicle) {
        if (this.obstacleEffect.timeLeft > 0 && this.obstacleEffect.type === ObstacleType.Booster) {
            // Do not change speed
        } else if (this.speed > 0) {
            const accelerationModifier = this.obstacleEffect.timeLeft > 0 && this.obstacleEffect.type === ObstacleType.Pothole ? 5 : 1;
            this.speed = Math.max(0, this.speed - acceleration * 1.5 * accelerationModifier);
        }

        const speedModifier = this.obstacleEffect.timeLeft > 0 && this.obstacleEffect.type === ObstacleType.Booster ? 1.5 : 1;
        const newPosition = new Vector3 (
            object.getVehicle().position.x - Math.sin(object.getVehicle().rotation.y) * speedModifier * this.speed,
            0,
            object.getVehicle().position.z - Math.cos(object.getVehicle().rotation.y) * speedModifier * this.speed
        );

        const moveEvent = new VehicleMoveEvent(object.getVehicle().position, newPosition, object);
        this.vehicleMoveEventService.sendVehicleMoveEvent(moveEvent);
        if (!moveEvent.isCancelled()) {
            object.getVehicle().position.x = newPosition.x;
            object.getVehicle().position.z = newPosition.z;
        }
    }

    private leftRotation(object: Vehicle) {
        if (this.obstacleEffect.timeLeft <= 0 || this.obstacleEffect.type !== ObstacleType.Puddle) {
            const newRotation =  object.getVehicle().rotation.y + rotationSpeed;
            const rotateEvent = new VehicleRotateEvent(object.getVehicle().rotation.y, newRotation, object);
            this.vehicleRotateEventService.sendVehicleRotateEvent(rotateEvent);
            if (!rotateEvent.isCancelled()) {
                object.getVehicle().rotation.y = newRotation;
            }
        }
    }

    private rightRotation(object: Vehicle) {
        if (this.obstacleEffect.timeLeft <= 0 || this.obstacleEffect.type !== ObstacleType.Puddle) {
            const newRotation =  object.getVehicle().rotation.y - rotationSpeed;
            const rotateEvent = new VehicleRotateEvent(object.getVehicle().rotation.y, newRotation, object);
            this.vehicleRotateEventService.sendVehicleRotateEvent(rotateEvent);
            if (!rotateEvent.isCancelled()) {
                object.getVehicle().rotation.y = newRotation;
            }
        }
    }
}
