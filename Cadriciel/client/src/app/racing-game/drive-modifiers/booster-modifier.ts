import { DriveModifier } from './drive-modifier';
import { Vector3 } from 'three';

export class BoosterModifier extends DriveModifier {
    public getModifiedSpeed(speed: Vector3): Vector3 {
        return speed.clone().multiplyScalar(1.5);
    }

    public getVerticalPositionModifier() {
        return 0;
    }

    public getAccelerationMultiplier() {
        return 1;
    }

    public getDecelerationMultiplier() {
        return 0;
    }

    public getRotationMultiplier() {
        return 1;
    }

    protected getTotalTime() {
        return 120;
    }
}
