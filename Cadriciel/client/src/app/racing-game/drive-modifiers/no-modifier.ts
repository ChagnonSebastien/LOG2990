import { DriveModifier } from './drive-modifier';
import { Vector3 } from 'three';

export class NoModifier extends DriveModifier {
    public getModifiedSpeed(speed: Vector3): Vector3 {
        return speed;
    }

    public getVerticalPositionModifier() {
        return 0;
    }

    public getAccelerationMultiplier() {
        return 1;
    }

    public getDecelerationMultiplier() {
        return 1;
    }

    public getRotationMultiplier() {
        return 1;
    }

    protected getTotalTime() {
        return -1;
    }
}
