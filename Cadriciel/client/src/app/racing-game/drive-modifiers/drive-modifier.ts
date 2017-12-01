import { Vector3 } from 'three';

export abstract class DriveModifier {
    private activeTime: number;

    constructor() {
        this.activeTime = 0;
    }

    public abstract getModifiedSpeed(speed: Vector3): Vector3;

    public abstract getVerticalPositionModifier();

    public abstract getAccelerationMultiplier();

    public abstract getDecelerationMultiplier();

    public abstract getRotationMultiplier();

    protected abstract getTotalTime();

    public isOver() {
        return this.activeTime++ === this.getTotalTime();
    }
}
