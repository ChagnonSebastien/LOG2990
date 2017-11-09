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

    public toggleCheatMode(): boolean {
        this.cheatMode = !this.cheatMode;
        return this.cheatMode;
    }

    public setInitialCountdown(initialCountdown: number): boolean {
        if (initialCountdown > 0 && !this.isDecimal(initialCountdown)) {
            this.initialCountdown = initialCountdown;
            this.initialCountdownChanges.next(initialCountdown);
            return true;
        }
        return false;
    }

    private isDecimal(n: number) {
        return n % 1 !== 0;
    }
}
