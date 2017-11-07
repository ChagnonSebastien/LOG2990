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
    ) {
        this.listenForWordSelections();
        this.listenForLetterInputs();
        this.listenForBackspaces();
        this.listenForArrowKeys();
    }

    // handlers
    private listenForWordSelections() {
        this.hintsService.selectedWordAlerts()
            .subscribe((wordSelection) => {
                this.focusOnWord(wordSelection.current);
            });
    }

    private listenForLetterInputs() {
        this.keyboardService.letterInputAlerts()
            .subscribe((input) => {
                this.focusOnNextLetter(input.i, input.j);
            });
    }

    private listenForBackspaces() {
        this.keyboardService.backspaceAlerts()
            .subscribe((square) => {
                this.focusOnPreviousLetter(square.i, square.j);
            });
    }

    private listenForArrowKeys() {
        this.keyboardService.arrowAlerts()
            .subscribe((arrowInput) => {
                this.handleArrows(arrowInput.charCode, arrowInput.i, arrowInput.j);
            });
    }

    // focus
    private focusOnWord(wordWithIndex: Word) {
        this.focusOnSquare(wordWithIndex.i, wordWithIndex.j);
    }

    private handleArrows(keyCode: number, i: number, j: number) {
        if (this.keyboardService.isLeftArrow(keyCode)
            || this.keyboardService.isUpArrow(keyCode)) {
            this.focusOnPreviousLetter(i, j);
        } else {
            this.focusOnNextLetter(i, j);
        }
    }

    private focusOnSquare(i: number, j: number) {
        this.squares.toArray().find((e) => {
            return e.nativeElement.getAttribute('id') === `${i}_${j}`;
        }).nativeElement.focus();
    }

    private focusOnNextLetter(i: number, j: number) {
        const selectedWordWithIndex = this.wordsService
            .getWordWithIndex(this.hintsService.selectedWord);
        if (selectedWordWithIndex.horizontal) {
            j = j + 1 < selectedWordWithIndex.j + selectedWordWithIndex.word.length ? j + 1 : j;
        } else {
            i = i + 1 < selectedWordWithIndex.i + selectedWordWithIndex.word.length ? i + 1 : i;
        }
        this.focusOnSquare(i, j);
    }

    private focusOnPreviousLetter(i: number, j: number) {
        const selectedWordWithIndex = this.wordsService
            .getWordWithIndex(this.hintsService.selectedWord);
        if (selectedWordWithIndex.horizontal) {
            j = j - 1 >= selectedWordWithIndex.j ? j - 1 : j;
        } else {
            i = i - 1 >= selectedWordWithIndex.i ? i - 1 : i;
        }
        this.focusOnSquare(i, j);
    }
}
