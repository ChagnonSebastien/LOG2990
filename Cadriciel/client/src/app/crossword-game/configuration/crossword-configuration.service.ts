import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { Config } from './config';
import { Type } from './type';
import { Level } from './level';
import { Mode } from './mode';

@Injectable()
export class CrosswordConfigurationService {
    public type: string;
    public mode: string;
    public level: string;
    public startGameSubject: Subject<Config>;

    constructor() {
        this.type = Type.SOLO;
        this.mode = Mode.CLASSIC;
        this.level = Level.NORMAL;
        this.startGameSubject = new Subject();
    }

    public startGameAlerts(): Observable<any> {
        return this.startGameSubject.asObservable();
    }

    public startGame(): boolean {
        this.startGameSubject
            .next(new Config(this.type, this.mode, this.level));
        return true;
    }

    public isMultiplayer(): boolean {
        return this.type === Type.MULTIPLAYER;
    }

    public isDynamic(): boolean {
        return this.mode === Mode.DYNAMIC;
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
