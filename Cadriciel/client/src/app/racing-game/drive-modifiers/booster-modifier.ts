import { DriveModifier } from './drive-modifier';
import { Settings } from '../settings';

export class BoosterModifier extends DriveModifier {
    public getModifiedSpeed(speed: number) {
        return speed * Settings.DRIVE_MODIFIER_BOOSTER_SPEED_MULTIPLIER;
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
