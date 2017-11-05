import { Component, OnInit, ViewChildren, Input, Output, EventEmitter } from '@angular/core';
import { KeyboardService } from './keyboard.service';
import { CrosswordGridService } from './crossword-grid/crossword-grid.service';
import { CrosswordGameService } from './crossword-game.service';
import { CrosswordHintsService } from './crossword-hints/crossword-hints.service';
import { GameManagerServicePlayer1 } from './crossword-game-manager-player1.service';

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
    public selectedWord: string;
    @ViewChildren('square') public squares;

    constructor(
        private keyboardService: KeyboardService,
        public crosswordGameService: CrosswordGameService,
        private gridService: CrosswordGridService,
        private hintsService: CrosswordHintsService,
        private gameManagerServicePlayer1: GameManagerServicePlayer1
    ) {
        this.endGameEmitter = new EventEmitter<boolean>();
    }

    public ngOnInit() {
        if (this.gameManagerServicePlayer1.getGame().option === 'solo') {
            this.newGame();
        } else {
            this.newMultiplayerGame();
        }
    }

    private async newGame() {
        await this.crosswordGameService.newGame(this.level);
    }

    private newMultiplayerGame() {
        this.crosswordGameService.newMultiplayerGame(this.gameManagerServicePlayer1.getGame().crossword);
    }

    public endGame() {
        this.endGameEmitter.emit(true);
    }

    private disableEvent(event: any): void {
        event.preventDefault();
        event.returnValue = false;
    }

    public unselectWord() {
        if (this.selectedWord) {
            this.crosswordGameService.clearSelectedWord(this.selectedWord);
            this.selectedWord = '';
        }
    }

    public focusOnWord(word: string) {
        this.selectedWord = word;
        const wordInfo = this.hintsService.getWordInfo(word);
        this.focusOnSquare(wordInfo.i, wordInfo.j);
    }

    public handleInput(event: KeyboardEvent, i: number, j: number): void {
        const charCode = event.which || event.keyCode;
        if (this.keyboardService.isLetter(charCode)) {
            if (this.gridService.grid[i][j].selected) {
                this.crosswordGameService.insertLetter(charCode, i, j);
            }
            this.focusOnNextLetter(i, j);
            this.disableEvent(event);
        } else if (this.keyboardService.isBackspace(charCode)) {
            if (this.gridService.grid[i][j].selected) {
                this.crosswordGameService.eraseLetter(i, j);
            }
            this.focusOnPreviousLetter(i, j);
            this.disableEvent(event);
        } else if (this.keyboardService.isArrowKey(charCode)) {
            this.handleArrows(charCode, i, j);
        } else if (!this.validInputs(charCode)) {
            this.disableEvent(event);
        }
    }

    private handleArrows(keyCode: number, i: number, j: number) {
        if (this.keyboardService.isLeftArrow(keyCode)
            || this.keyboardService.isUpArrow(keyCode)) {
            this.focusOnPreviousLetter(i, j);
        } else {
            this.focusOnNextLetter(i, j);
        }
    }

    private validInputs(keyCode: number): boolean {
        return this.keyboardService.isTab(keyCode);
    }

    private focusOnSquare(i: number, j: number) {
        this.squares.toArray().find((e) => {
            return e.nativeElement.getAttribute('id') === `${i}_${j}`;
        }).nativeElement.focus();
    }

    private focusOnNextLetter(i: number, j: number) {
        const wordInfo = this.hintsService.getWordInfo(this.selectedWord);
        if (wordInfo.horizontal) {
            j = j + 1 < wordInfo.j + wordInfo.word.length ? j + 1 : j;
        } else {
            i = i + 1 < wordInfo.i + wordInfo.word.length ? i + 1 : i;
        }
        this.focusOnSquare(i, j);
    }

    private focusOnPreviousLetter(i: number, j: number) {
        const wordInfo = this.hintsService.getWordInfo(this.selectedWord);
        if (wordInfo.horizontal) {
            j = j - 1 >= wordInfo.j ? j - 1 : j;
        } else {
            i = i - 1 >= wordInfo.i ? i - 1 : i;
        }
        this.focusOnSquare(i, j);
    }
}
