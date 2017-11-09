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

    public startGame() {
        this.startGameSubject.next({
            type: this.type,
            mode: this.mode,
            level: this.level
        });
    }

    public isMultiplayer(): boolean {
        return this.type === 'multiplayer';
    }

    public isDynamic(): boolean {
        return this.mode === 'dynamic';
    }

    public setType(type: string): void {
        if (this.validType(type)) {
            this.type = type;
        }
    }

    public setMode(mode: string): void {
        if (this.validMode(mode)) {
            this.mode = mode;
        }
    }

    public setLevel(level: string): void {
        if (this.validLevel(level)) {
            this.level = level;
        }
    }

    private validType(type: string) {
        const validTypes = new Set<string>(['solo', 'multiplayer']);
        return validTypes.has(type);
    }

    private validMode(mode: string) {
        const validModes = new Set<string>(['classic', 'dynamic']);
        return validModes.has(mode);
    }

    private validLevel(level: string) {
        const validLevels = new Set<string>(['easy', 'normal', 'hard']);
        return validLevels.has(level);
    }
}
