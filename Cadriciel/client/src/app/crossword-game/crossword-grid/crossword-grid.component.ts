import { Component, ViewChildren } from '@angular/core';

import { CrosswordGridService } from './crossword-grid.service';
import { CrosswordHintsService } from '../crossword-hints/crossword-hints.service';
import { CrosswordWordsService } from '../crossword-words.service';
import { KeyboardService } from '../keyboard.service';

import { Word } from '../../../../../commun/word';

@Component({
    selector: 'app-crossword-grid',
    templateUrl: './crossword-grid.component.html',
    styleUrls: ['./crossword-grid.component.css']
})
export class CrosswordGridComponent {
    private selectedWord: string;
    @ViewChildren('square') public squares;

    constructor(
        public gridService: CrosswordGridService,
        private hintsService: CrosswordHintsService,
        private wordsService: CrosswordWordsService,
        private keyboardService: KeyboardService
    ) { }

    public focusOnWord(wordWithIndex: Word) {
        this.focusOnSquare(wordWithIndex.i, wordWithIndex.j);
    }

    public handleInput(event: KeyboardEvent, i: number, j: number): void {
        const charCode = event.which || event.keyCode;
        if (this.keyboardService.isLetter(charCode)) {
            if (this.gridService.grid[i][j].selected) {
                this.gridService.insertLetter(
                    String.fromCharCode(charCode).toLowerCase(), i, j
                );
            }
            this.focusOnNextLetter(i, j);
            this.disableEvent(event);
        } else if (this.keyboardService.isBackspace(charCode)) {
            if (this.gridService.grid[i][j].selected) {
                this.gridService.eraseLetter(i, j);
            }
            this.focusOnPreviousLetter(i, j);
            this.disableEvent(event);
        } else if (this.keyboardService.isArrowKey(charCode)) {
            this.handleArrows(charCode, i, j);
        } else if (!this.validInputs(charCode)) {
            this.disableEvent(event);
        }
    }

    private disableEvent(event: any): void {
        event.preventDefault();
        event.returnValue = false;
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
        const wordInfo = this.wordsService.getWordWithIndex(this.selectedWord);
        if (wordInfo.horizontal) {
            j = j + 1 < wordInfo.j + wordInfo.word.length ? j + 1 : j;
        } else {
            i = i + 1 < wordInfo.i + wordInfo.word.length ? i + 1 : i;
        }
        this.focusOnSquare(i, j);
    }

    private focusOnPreviousLetter(i: number, j: number) {
        const wordInfo = this.wordsService.getWordWithIndex(this.selectedWord);
        if (wordInfo.horizontal) {
            j = j - 1 >= wordInfo.j ? j - 1 : j;
        } else {
            i = i - 1 >= wordInfo.i ? i - 1 : i;
        }
        this.focusOnSquare(i, j);
    }
}
