import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CrosswordCheatService {
    public cheatMode: boolean;
    public initialCountdown: number;
    private initialCountdownChanges: Subject<any>;

    constructor() {
        this.initialCountdownChanges = new Subject();
        this.cheatMode = false;
        this.initialCountdown = 30;
    }

    public initialCountdownChangedAlerts(): Observable<any> {
        return this.initialCountdownChanges.asObservable();
    }

    public toggleCheatMode() {
        this.cheatMode = !this.cheatMode;
    }

    public setInitialCountdown(initialCountdown: number) {
        if (initialCountdown > 0 && !this.isDecimal(initialCountdown)) {
            this.initialCountdown = initialCountdown;
            this.initialCountdownChanges.next(initialCountdown);
        }
    }

    private isDecimal(n: number) {
        return n % 1 !== 0;
    }
}
