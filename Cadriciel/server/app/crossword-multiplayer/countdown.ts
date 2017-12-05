import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { INITIAL_COUNTDOWN_VALUE, ONE_SECOND } from '../config';

export class Countdown {
    public initialCountdownValue: number;
    public count: BehaviorSubject<number>;
    private countdownId: number;

    constructor() {
        this.initialCountdownValue = INITIAL_COUNTDOWN_VALUE;
        this.count = new BehaviorSubject(this.initialCountdownValue);
        this.resetCountdown();
    }

    public startCountdown(): boolean {
        if (this.countdownId === undefined) {
            this.countdownId = setInterval(this.decrementCount.bind(this), ONE_SECOND);
            return true;
        }
        return false;
    }

    public stopCountdown(): boolean {
        if (this.countdownId !== undefined) {
            clearInterval(this.countdownId);
            return true;
        }
        return false;
    }

    public resetCountdown(): void {
        this.count.next(this.initialCountdownValue);
    }

    private decrementCount(): void {
        if (this.count.value > 0) {
            this.count.next(this.count.value - 1);
        } else {
            this.resetCountdown();
        }
    }
}
