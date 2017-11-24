import { DriveModifier } from './drive-modifier';

export class BoosterModifier extends DriveModifier {
    public getModifiedSpeed(speed: number) {
        return speed * 1.5;
    }

    public getVerticalPositionModifier() {
        return 0;
    }

    public getAccelerationMultiplier() {
        return 1;
    }

    public getDecelerationMultiplier() {
        return 0;
    }

    public getRotationMultiplier() {
        return 1;
    }

    protected getTotalTime() {
        return 120;
    }
}
