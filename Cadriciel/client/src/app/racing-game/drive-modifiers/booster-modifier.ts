import { DriveModifier } from './drive-modifier';
import { Settings } from '../settings';

export class BoosterModifier extends DriveModifier {
    public getModifiedSpeed(speed: number): number {
        return speed * Settings.DRIVE_MODIFIER_BOOSTER_SPEED_MULTIPLIER;
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
