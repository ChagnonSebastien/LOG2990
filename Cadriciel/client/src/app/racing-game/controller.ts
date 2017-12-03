import { NoModifier } from './drive-modifiers/no-modifier';
import { VehicleRotateEventService, VehicleRotateEvent } from './events/vehicle-rotate-event.service';
import { VehicleMoveEventService, VehicleMoveEvent } from './events/vehicle-move-event.service';
import { ObstacleType } from './draw-track/obstacle';
import { Vector3 } from 'three';
import { Vehicle } from './vehicle';
import { DriveModifier } from './drive-modifiers/drive-modifier';
import { BoosterModifier } from './drive-modifiers/booster-modifier';
import { PotholeModifier } from './drive-modifiers/pothole-modifier';
import { PuddleModifier } from './drive-modifiers/puddle-modifier';
const acceleration = 0.1;
const rotationSpeed = Math.PI / 100;
const maxSpeed = 35;

export enum MOVE_STATE { MOVE_FORWARD, BRAKE }
export enum TURN_STATE { TURN_LEFT, TURN_RIGHT, DO_NOTHING }

export abstract class Controller {
    protected speed: number;

    protected moveState: MOVE_STATE;

    protected turnState: TURN_STATE;

    private driveModifier: DriveModifier;

    constructor(
        protected vehicleMoveEventService: VehicleMoveEventService,
        protected vehicleRotateEventService: VehicleRotateEventService
    ) {
        this.speed = 0;
        this.driveModifier = new NoModifier();
        this.moveState = MOVE_STATE.BRAKE;
        this.turnState = TURN_STATE.DO_NOTHING;
    }

    public hitWall(speedModifier: number) {
        this.speed = Math.min(maxSpeed * speedModifier, this.speed * 0.98 * speedModifier);
    }

    public hitObstacle(type: ObstacleType) {
        switch (type) {
            case ObstacleType.Booster:
                this.driveModifier = new BoosterModifier();
                break;
            case ObstacleType.Pothole:
                this.driveModifier = new PotholeModifier();
                break;
            case ObstacleType.Puddle:
                this.driveModifier = new PuddleModifier();
                break;
        }
    }

    public nextFrame(vehicle: Vehicle) {
        this.modifySpeed();
        this.moveVehicle(vehicle);

        if (this.turnState === TURN_STATE.TURN_RIGHT) {
            this.rightRotation(vehicle);
        }

        if (this.turnState === TURN_STATE.TURN_LEFT) {
            this.leftRotation(vehicle);
        }

        if (this.driveModifier.isOver()) {
            this.driveModifier = new NoModifier();
        }
    }

    private modifySpeed() {
        if (this.moveState === MOVE_STATE.MOVE_FORWARD) {
            this.speed = Math.min(maxSpeed, Math.max(0, this.speed + acceleration * this.driveModifier.getAccelerationMultiplier()));
        } else {
            if (this.speed > 0) {
                this.speed = Math.max(0, this.speed - acceleration * 1.5 * this.driveModifier.getDecelerationMultiplier());
            }
        }
    }

    private moveVehicle(object: Vehicle) {
        const newPosition = new Vector3(
            object.getMesh().position.x - Math.sin(object.getMesh().rotation.y) * this.driveModifier.getModifiedSpeed(this.speed),
            0,
            object.getMesh().position.z - Math.cos(object.getMesh().rotation.y) * this.driveModifier.getModifiedSpeed(this.speed)
        );

        const moveEvent = new VehicleMoveEvent(object.getMesh().position, newPosition, object);
        this.vehicleMoveEventService.sendVehicleMoveEvent(moveEvent);
        if (!moveEvent.isCancelled()) {
            object.getMesh().position.x = moveEvent.getNewPosition().x;
            object.getMesh().position.y = 3 + this.driveModifier.getVerticalPositionModifier();
            object.getMesh().position.z = moveEvent.getNewPosition().z;
        }
    }

    private leftRotation(object: Vehicle) {
        const newRotation = object.getMesh().rotation.y + rotationSpeed * this.driveModifier.getRotationMultiplier();
        this.rotateVehicle(object, newRotation);
    }

    private rightRotation(object: Vehicle) {
        const newRotation = object.getMesh().rotation.y - rotationSpeed * this.driveModifier.getRotationMultiplier();
        this.rotateVehicle(object, newRotation);
    }

    private rotateVehicle(object: Vehicle, newRotation: number) {
        const rotateEvent = new VehicleRotateEvent(object.getMesh().rotation.y, newRotation, object);
        this.vehicleRotateEventService.sendVehicleRotateEvent(rotateEvent);
        if (!rotateEvent.isCancelled()) {
            object.getMesh().rotation.y = newRotation;
        }
    }
}
