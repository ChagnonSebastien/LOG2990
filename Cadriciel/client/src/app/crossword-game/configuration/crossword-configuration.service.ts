import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CrosswordConfigurationService {
    public type: string;
    public mode: string;
    public level: string;
    private startGameSubject: Subject<any>;

    constructor() {
        this.type = 'solo';
        this.mode = 'classic';
        this.level = 'normal';
        this.startGameSubject = new Subject();
    }

    public startGameAlerts(): Observable<any> {
        return this.startGameSubject.asObservable();
    }

    public startGame(): boolean {
        this.startGameSubject.next({
            type: this.type,
            mode: this.mode,
            level: this.level
        });
        return true;
    }

    public isMultiplayer(): boolean {
        return this.type === 'multiplayer';
    }

    public isDynamic(): boolean {
        return this.mode === 'dynamic';
    }

    public setType(type: string): boolean {
        if (this.validType(type)) {
            this.type = type;
            return true;
        }
        return false;
    }

    public setMode(mode: string): boolean {
        if (this.validMode(mode)) {
            this.mode = mode;
            return true;
        }
        return false;
    }

    public setLevel(level: string): boolean {
        if (this.validLevel(level)) {
            this.level = level;
            return true;
        }
        return false;
    }

    private validType(type: string): boolean {
        const validTypes = new Set<string>(['solo', 'multiplayer']);
        return validTypes.has(type);
    }

    private validMode(mode: string): boolean {
        const validModes = new Set<string>(['classic', 'dynamic']);
        return validModes.has(mode);
    }

    private validLevel(level: string): boolean {
        const validLevels = new Set<string>(['easy', 'normal', 'hard']);
        return validLevels.has(level);
    }
}
