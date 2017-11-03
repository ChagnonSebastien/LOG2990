import { Component, Input } from '@angular/core';
import { PlayerManagerService } from '../crossword-player-manager.service';
import { GameManagerService } from '../crossword-game-manager.service';
@Component({
    selector: 'app-crossword-menu',
    templateUrl: './crossword-menu.component.html',
    styleUrls: ['./crossword-menu.component.css'],
})
export class CrosswordMenuComponent {
    public gameInProgress: boolean;
    public multiplayerGameInProgress: boolean;
    public creatingGame: boolean;
    public joiningGame: boolean;
    public type: string;
    public mode: string;
    public level: string;
    public waitingForPlayer2: boolean;
    @Input() public username: string;

    constructor(private playerManagerService: PlayerManagerService, private gameManagerService: GameManagerService ) {
        this.type = 'solo';
        this.mode = 'classic';
        this.level = 'normal';
        this.username = '';
    }

    public startGame() {

        if (this.type === 'multiplayer') {
            this.startMultiplayerGame();
        } else {
            this.gameInProgress = true;
        }
    }

    public startMultiplayerGame(): void {

        if (this.validateUsername()) {

            this.setPlayerUsername();
            this.playerManagerService.getPlayer();
            this.waitingForPlayer2 = true;
            this.gameManagerService.createGame(this.type, this.level, this.mode, this.playerManagerService.getPlayer());
        }
    }

    public setPlayerUsername(): void {
        this.playerManagerService.getPlayer().setUsername(this.getUsername());
    }
    public getUsername(): string {
        return this.username;
    }

    public validateUsername() {
        return this.getUsername() !== '';
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
