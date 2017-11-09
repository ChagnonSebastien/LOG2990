import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { CrosswordConfigurationService } from '../configuration/crossword-configuration.service';
import { CrosswordCheatService } from '../cheat/crossword-cheat.service';

@Injectable()
export class CrosswordCountdownService {
    public count: number;
    public initialCount: number;
    private countdownId: number;
    private countdownReachedZero: Subject<any>;

    constructor(
        private configurationService: CrosswordConfigurationService,
        private cheatService: CrosswordCheatService
    ) {
        this.countdownReachedZero = new Subject();
    }

    public newGame(): boolean {
        if (this.configurationService.isDynamic()) {
            this.initialCount = this.cheatService.initialCountdown;
            this.resetCountdown();
            if (this.countdownId === undefined) {
                this.startCountdown();
            }
            return true;
        }
        return false;
    }

    public countdownReachedZeroAlerts(): Observable<any> {
        return this.countdownReachedZero.asObservable();
    }

    public startCountdown() {
        this.countdownId = setInterval(this.decrementCounter.bind(this), 1000);
    }

    public stopCountdown() {
        if (this.countdownId !== undefined) {
            clearInterval(this.countdownId);
            this.countdownId = undefined;
        }
    }

    public resetCountdown() {
        this.count = this.initialCount;
    }

    private decrementCounter() {
        if (this.count > 0) {
            this.count--;
        } else {
            this.countdownReachedZero.next(true);
            this.resetCountdown();
        }
    }
}
