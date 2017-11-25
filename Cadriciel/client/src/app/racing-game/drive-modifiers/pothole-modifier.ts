import { DriveModifier } from './drive-modifier';
import * as SETTINGS from '../settings';

export class PotholeModifier extends DriveModifier {
    public getModifiedSpeed(speed: number) {
        return Math.max(0.5, speed);
    }

    public getVerticalPositionModifier() {
        return Math.random() * SETTINGS.SCENE_SCALE;
    }

    public getAccelerationMultiplier() {
        return -5 * 1.5;
    }

    public getDecelerationMultiplier() {
        return 5;
    }

    public getRotationMultiplier() {
        return 1;
    }

    protected getTotalTime() {
        return 30;
    }
}
