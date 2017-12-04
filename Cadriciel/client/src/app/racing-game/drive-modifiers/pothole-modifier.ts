import { DriveModifier } from './drive-modifier';
import { Settings } from '../settings';

export class PotholeModifier extends DriveModifier {
    public getModifiedSpeed(speed: number) {
        return Math.max(Settings.DRIVE_MODIFIER_POTHOLE_MINIMUM_SPEED, speed);
    }

    public getVerticalPositionModifier() {
        return Math.random() * Settings.SCENE_SCALE;
    }

    public getAccelerationMultiplier() {
        return Settings.DRIVE_MODIFIER_POTHOLE_ACCELERATION;
    }

    public getDecelerationMultiplier() {
        return Settings.DRIVE_MODIFIER_POTHOLE_DECELERATION;
    }

    public getRotationMultiplier() {
        return Settings.DRIVE_MODIFIER_POTHOLE_ROTATION;
    }

    protected getTotalTime() {
        return Settings.DRIVE_MODIFIER_POTHOLE_TIME;
    }
}
