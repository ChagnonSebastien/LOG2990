import { Vector3 } from 'three';

export class CountdownDecreaseEvent {
    constructor(
        private newAmount: number
    ) {}

    public getNewAmount(): number {
        return this.newAmount;
    }
}
