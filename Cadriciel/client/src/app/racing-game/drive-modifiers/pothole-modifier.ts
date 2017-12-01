import { Vector3 } from 'three';
import { DriveModifier } from './drive-modifier';
import { Settings } from '../settings';

export class PotholeModifier extends DriveModifier {
    public getModifiedSpeed(speed: Vector3): Vector3 {
        return speed.clone().clampLength(0, Math.max(0.5, speed.length()));
    }

    public getVerticalPositionModifier() {
        return Math.random() * Settings.SCENE_SCALE;
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
