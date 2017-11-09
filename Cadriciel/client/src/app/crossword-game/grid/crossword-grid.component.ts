import { Component, ViewChildren } from '@angular/core';
import { WordUtilities } from '../utilities/word-utilities';

import { CrosswordGridService } from './crossword-grid.service';
import { CrosswordHintsService } from '../hints/crossword-hints.service';
import { CrosswordWordsService } from '../words/crossword-words.service';
import { CrosswordKeyboardService } from '../keyboard/crossword-keyboard.service';
import { CrosswordConfigurationService } from '../configuration/crossword-configuration.service';

import { Word } from '../../../../../commun/word';

@Component({
    selector: 'app-crossword-grid',
    templateUrl: './crossword-grid.component.html',
    styleUrls: ['./crossword-grid.component.css']
})
export class CrosswordGridComponent {
    @ViewChildren('square') public squares;

    constructor(
        public gridService: CrosswordGridService,
        private hintsService: CrosswordHintsService,
        private wordsService: CrosswordWordsService,
        private keyboardService: CrosswordKeyboardService,
        public configurationService: CrosswordConfigurationService
    ) {
        this.listenForWordSelections();
        this.listenForLetterInputs();
        this.listenForBackspaces();
        this.listenForArrowKeys();
    }

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

    private handleArrows(keyCode: number, i: number, j: number) {
        if (this.keyboardService.isLeftArrow(keyCode)
            || this.keyboardService.isUpArrow(keyCode)) {
            this.focusOnPreviousLetter(i, j);
        } else {
            this.focusOnNextLetter(i, j);
        }
    }

    private focusOnWord(wordWithIndex: Word) {
        this.focusOnSquare(wordWithIndex.i, wordWithIndex.j);
    }

    private focusOnSquare(i: number, j: number) {
        this.squares.toArray().find((e) => {
            return e.nativeElement.getAttribute('id') === `${i}_${j}`;
        }).nativeElement.focus();
    }

    private focusOnNextLetter(i: number, j: number): boolean {
        if (this.hintsService.selectedWord === undefined) {
            return false;
        }
        const wordInfo = this.wordsService
            .getWordWithIndex(this.hintsService.selectedWord);
        if (wordInfo.horizontal) {
            j = WordUtilities.endOfWord(wordInfo, i, j) ? j : j + 1;
        } else {
            i = WordUtilities.endOfWord(wordInfo, i, j) ? i : i + 1;
        }
        this.focusOnSquare(i, j);
        return true;
    }

    private focusOnPreviousLetter(i: number, j: number): boolean {
        if (this.hintsService.selectedWord === undefined) {
            return false;
        }
        const wordInfo = this.wordsService
            .getWordWithIndex(this.hintsService.selectedWord);

        if (wordInfo !== undefined || wordInfo.horizontal) {
            j = WordUtilities.beginningOfWord(wordInfo, i, j) ? j : j - 1;
        } else {
            i = WordUtilities.beginningOfWord(wordInfo, i, j) ? i : i - 1;
        }
        this.focusOnSquare(i, j);
        return true;
    }
}
