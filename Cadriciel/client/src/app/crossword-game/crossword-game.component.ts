import { Component, OnInit, ViewChildren, Input, Output, EventEmitter } from '@angular/core';
import { KeyboardService } from './keyboard.service';
import { CrosswordGridService } from './crossword-grid/crossword-grid.service';
import { CrosswordGameService } from './crossword-game.service';
import { CrosswordHintsService } from './crossword-hints/crossword-hints.service';
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
        private keyboardService: KeyboardService,
        public crosswordGameService: CrosswordGameService,
        private gridService: CrosswordGridService,
        private hintsService: CrosswordHintsService,
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

