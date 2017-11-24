export abstract class Cancellable {
    private cancelled: boolean;

    constructor() {
        this.cancelled = false;
    }

    public cancel(): void {
        this.cancelled = true;
    }

    public isCancelled(): boolean {
        return this.cancelled;
    }
}
