import { DriveModifier } from './drive-modifier';

export class NoModifier extends DriveModifier {
    public getModifiedSpeed(speed: number) {
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
