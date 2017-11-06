import { Component } from '@angular/core';
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
    public username: string;

    constructor(private playerManagerService: PlayerManagerService, private gameManagerService: GameManagerService) {
        this.type = 'solo';
        this.mode = 'classic';
        this.level = 'normal';
        this.username = '';
    }

    public startGame() {
        if (this.type === 'multiplayer') {
            this.startMultiplayerGame();
            this.startGameOnPlayer2Joined();
            this.endGameOnOpponentLeft();
        } else {
            this.gameInProgress = true;
        }
    }

    public startMultiplayerGame(): void {

        if (this.validateUsername()) {
            this.setPlayerUsername();
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

    public setStartBooleans() {
        this.waitingForPlayer2 = false;
        this.joiningGame = false;
        this.gameInProgress = true;
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

    private startGameOnPlayer2Joined() {
        this.gameManagerService.playerTwoAlerts()
            .subscribe((result) => {
                console.log(result);
                this.setStartBooleans();
            });
    }

    private endGameOnOpponentLeft() {
        this.gameManagerService.leaveGameAlerts()
            .subscribe((result) => {
                console.log(result);
                this.gameInProgress = false;
            });
    }

}
