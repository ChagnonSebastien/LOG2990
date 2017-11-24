import { DriveModifier } from './drive-modifier';

export class PuddleModifier extends DriveModifier {
    public getModifiedSpeed(speed: number) {
        return Math.max(0.5, speed);
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
