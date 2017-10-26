import { Component } from '@angular/core';

@Component({
    selector: 'app-crossword-menu',
    templateUrl: './crossword-menu.component.html',
    styleUrls: ['./crossword-menu.component.css'],
})
export class CrosswordMenuComponent {
    public gameInProgress: boolean;
    public type: string;
    public mode: string;
    public level: string;
    public username: string;
    public multiplayerGameReady;

    constructor() {
        this.type = 'solo';
        this.mode = 'classic';
        this.level = 'normal';
    }

    public startGame(type: string, mode: string, level: string) {
        this.gameInProgress = true;
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
