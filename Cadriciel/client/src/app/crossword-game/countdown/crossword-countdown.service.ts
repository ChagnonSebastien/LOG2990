import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { GameConfiguration } from '../game-configuration';

@Injectable()
export class CrosswordCountdownService {
    public count: number;
    public initialCount: number;
    private countdownId: number;
    private countdownReachedZero: Subject<any>;

    constructor(
    ) {
        this.countdownReachedZero = new Subject();
    }

    public newGame(): boolean {
        this.initialCount = GameConfiguration.INITIAL_COUNTDOWN_VALUE;
        return this.resetCountdown() && this.startCountdown();
    }

    public endGame(): boolean {
        return this.stopCountdown();
    }

    public countdownReachedZeroAlerts(): Observable<any> {
        return this.countdownReachedZero.asObservable();
    }

    public resetCountdown(): boolean {
        this.count = this.initialCount;
        if (this.count > 0 && this.count <= this.initialCount) {
            return true;
        }
        return false;
    }

    private startCountdown(): boolean {
        if (!this.countdownStarted()) {
            this.countdownId = setInterval(this.decrementCounter.bind(this), 1000);
            return true;
        }
        return false;
    }

    private stopCountdown(): boolean {
        if (this.countdownStarted()) {
            clearInterval(this.countdownId);
            this.countdownId = undefined;
            return true;
        }
        return false;
    }

    private decrementCounter(): boolean {
        if (this.count > 0) {
            this.count--;
            return true;
        } else {
            this.countdownReachedZero.next(true);
            this.resetCountdown();
            return false;
        }
    }

    private countdownStarted(): boolean {
        return this.countdownId !== undefined;
    }
}
