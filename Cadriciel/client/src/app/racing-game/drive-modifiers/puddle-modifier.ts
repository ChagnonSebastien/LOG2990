import { DriveModifier } from './drive-modifier';
import { Settings } from '../settings';

export class PuddleModifier extends DriveModifier {
    public getModifiedSpeed(speed: number) {
        return Math.max(Settings.DRIVE_MODIFIER_PUDDLE_MINIMUM_SPEED, speed);
    }

    public getVerticalPositionModifier() {
        return Settings.DRIVE_MODIFIER_PUDDLE_POSITION;
    }

    public getAccelerationMultiplier() {
        return Settings.DRIVE_MODIFIER_PUDDLE_ACCELERATION;
    }

    public getDecelerationMultiplier() {
        return Settings.DRIVE_MODIFIER_PUDDLE_DECELERATION;
    }

    public getRotationMultiplier() {
        return Settings.DRIVE_MODIFIER_PUDDLE_ROTATION;
    }

    protected getTotalTime() {
        return Settings.DRIVE_MODIFIER_PUDDLE_TIME;
    }
}
