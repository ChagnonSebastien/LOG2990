import { DriveModifier } from './drive-modifier';
import { Vector3 } from 'three';
import { Settings } from '../settings';

export class BoosterModifier extends DriveModifier {
    public getModifiedSpeed(speed: Vector3): Vector3 {
        return speed.clone().multiplyScalar(1.5);
    }

    public getVerticalPositionModifier() {
        return Settings.DRIVE_MODIFIER_BOOSTER_POSITION;
    }

    public getAccelerationMultiplier() {
        return Settings.DRIVE_MODIFIER_BOOSTER_ACCELERATION;
    }

    public getDecelerationMultiplier() {
        return Settings.DRIVE_MODIFIER_BOOSTER_DECELERATION;
    }

    public getRotationMultiplier() {
        return Settings.DRIVE_MODIFIER_BOOSTER_ROTATION;
    }

    protected getTotalTime() {
        return Settings.DRIVE_MODIFIER_BOOSTER_TIME;
    }
}
