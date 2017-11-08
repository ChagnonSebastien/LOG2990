import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { CrosswordConfigurationService } from './crossword-menu/crossword-configuration.service';

@Injectable()
export class CrosswordCountdownService {
    public count: number;
    public initialCount: number;
    private countdownId: number;
    private countdownReachedZero: Subject<any>;

    constructor(private configurationService: CrosswordConfigurationService) {
        this.countdownReachedZero = new Subject();
    }

    public newGame() {
        if (this.configurationService.isDynamic()) {
            this.initialCount = 10;
            this.resetCountdown();
            this.startCountdown();
        }
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
