export class CountdownDecreaseEvent {
    constructor(
        private newAmount: number
    ) {}

    public getNewAmount(): number {
        return this.newAmount;
    }
}
