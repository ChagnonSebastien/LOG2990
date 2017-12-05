import { DriveModifier } from './drive-modifier';
import { Vector3 } from 'three';
import { Settings } from '../settings';

export class BoosterModifier extends DriveModifier {
    public getModifiedSpeed(speed: Vector3): Vector3 {
        return speed.clone().multiplyScalar(1.5);
    }

    public getVerticalPositionModifier(): number {
        return Settings.DRIVE_MODIFIER_BOOSTER_POSITION;
    }

    public getAccelerationMultiplier(): number {
        return Settings.DRIVE_MODIFIER_BOOSTER_ACCELERATION;
    }

    public getDecelerationMultiplier(): number {
        return Settings.DRIVE_MODIFIER_BOOSTER_DECELERATION;
    }

    public getRotationMultiplier(): number {
        return Settings.DRIVE_MODIFIER_BOOSTER_ROTATION;
    }

    protected getTotalTime(): number {
        return Settings.DRIVE_MODIFIER_BOOSTER_TIME;
    }
}
