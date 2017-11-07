import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CrosswordGameService } from './crossword-game.service';
import { GameManagerService } from './crossword-game-manager.service';

@Component({
    selector: 'app-crossword-game',
    templateUrl: './crossword-game.component.html',
    styleUrls: ['./crossword-game.component.css']
})
export class CrosswordGameComponent implements OnInit {
    @Input() public type: string;
    @Input() public mode: string;
    @Input() public level: string;
    @Output() public endGameEmitter: EventEmitter<boolean>;

    constructor(
        public crosswordGameService: CrosswordGameService,
        private gameManagerService: GameManagerService
    ) {
        this.endGameEmitter = new EventEmitter<boolean>();
        this.endGameOnOpponentLeft();
    }

    public ngOnInit() {
        if (this.gameManagerService.getGame().option === 'solo') {
            this.newGame();
        } else {
            this.newMultiplayerGame();
        }
    }

    private async newGame() {
        await this.crosswordGameService.newGame(this.level);
    }

    private newMultiplayerGame() {
        this.crosswordGameService.newMultiplayerGame(this.gameManagerService.getGame().crossword);
    }

    public endGame() {
        this.gameManagerService.leaveGame();
    }

    private endGameOnOpponentLeft() {
        this.gameManagerService.leaveGameAlerts()
            .subscribe((result) => {
                this.endGameEmitter.emit(true);
            });
    }
}

