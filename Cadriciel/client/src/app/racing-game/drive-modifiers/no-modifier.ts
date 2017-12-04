import { DriveModifier } from './drive-modifier';
import { Settings } from '../settings';

export class NoModifier extends DriveModifier {
    public getModifiedSpeed(speed: number) {
        return speed;
    }

    public getVerticalPositionModifier() {
        return Settings.DRIVE_MODIFIER_NONE_POSITION;
    }

    public getAccelerationMultiplier() {
        return Settings.DRIVE_MODIFIER_NONE_ACCELERATION;
    }

    public getDecelerationMultiplier() {
        return Settings.DRIVE_MODIFIER_NONE_DECELERATION;
    }

    public getRotationMultiplier() {
        return Settings.DRIVE_MODIFIER_NONE_ROTATION;
    }

    protected getTotalTime() {
        return Settings.DRIVE_MODIFIER_NONE_TIME;
    }
}
