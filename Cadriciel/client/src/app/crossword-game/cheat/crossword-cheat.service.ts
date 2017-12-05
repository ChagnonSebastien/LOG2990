import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { GameConfiguration } from '../game-configuration';
import { MathUtilities } from '../../math.utilities';

@Injectable()
export class CrosswordCheatService {
    public cheatMode: boolean;
    public initialCountdown: number;
    public initialCountdownChanges: Subject<any>;

    constructor() {
        this.initialCountdownChanges = new Subject();
        this.cheatMode = false;
        this.initialCountdown = GameConfiguration.INITIAL_COUNTDOWN_VALUE;
    }

    public toggleCheatMode(): boolean {
        this.cheatMode = !this.cheatMode;
        return this.cheatMode;
    }

    public setInitialCountdown(initialCountdown: number): boolean {
        if (initialCountdown > 0 && !MathUtilities.isDecimal(initialCountdown)) {
            this.initialCountdown = initialCountdown;
            this.initialCountdownChanges.next(initialCountdown);
            return true;
        }
        return false;
    }
}
