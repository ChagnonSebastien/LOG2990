import { Vector3 } from 'three';
import { DriveModifier } from './drive-modifier';

export class PuddleModifier extends DriveModifier {
    public getModifiedSpeed(speed: Vector3): Vector3 {
        return speed.clone().clampLength(0, Math.max(0.5, speed.length()));
    }

    public getVerticalPositionModifier() {
        return 0;
    }

    public getAccelerationMultiplier() {
        return -1;
    }

    public getDecelerationMultiplier() {
        return 1;
    }

    public getRotationMultiplier() {
        return 0;
    }

    protected getTotalTime() {
        return 45;
    }
}
