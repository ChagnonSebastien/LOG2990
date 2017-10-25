import { Component, OnInit, ViewChildren } from '@angular/core';
import { CrosswordService } from './crossword.service';
import { KeyboardService } from './keyboard.service';
import { LexiconService } from './lexicon.service';

import { CrosswordGame } from './crossword-game';
import { Hint } from './hint';

@Component({
    selector: 'app-crossword-game',
    templateUrl: './crossword-game.component.html',
    styleUrls: ['./crossword-game.component.css']
})
export class CrosswordGameComponent implements OnInit {
    public crossword: CrosswordGame;
    public selectedWord: string;
    private hints: Array<Hint>;
    @ViewChildren('square') public squares;

    constructor(
        private crosswordService: CrosswordService,
        private keyboardService: KeyboardService,
        private lexiconService: LexiconService
    ) { }

    public ngOnInit() {
        this.crosswordService.getCrossword('easy').then((crossword) => {
            this.crossword = new CrosswordGame(
                crossword.crossword,
                crossword.wordsWithIndex,
                crossword.listOfWords
            );
            this.hints = new Array<Hint>();
            for (const word of this.crossword.wordsWithIndex) {
                this.lexiconService.getWordDefinition(word.word)
                    .catch((err) => {
                        this.handleError(err);
                    })
                    .then((definition) => {
                        this.hints.push(new Hint(word.word, definition));
                    });
            }
        });
    }

    private disableEvent(event: any): void {
        event.preventDefault();
        event.returnValue = false;
    }

    public selectWord(word: string) {
        if (this.selectedWord) {
            this.crossword.clearSelectedWord(this.selectedWord);
        }
        this.crossword.setSelectedWord(word);
        this.selectedWord = word;
        this.focusOnSelectedWord();
    }

    public handleInput(event: KeyboardEvent, i: number, j: number): void {
        const charCode = event.which || event.keyCode;
        if (this.keyboardService.isLetter(charCode) && this.crossword.status[i][j].selected) {
            this.crossword.insertLetter(charCode, i, j);
            this.focusOnNextLetter(i, j);
            this.disableEvent(event);
        } else if (this.keyboardService.isBackspace(charCode) && this.crossword.status[i][j].selected) {
            this.crossword.eraseLetter(i, j);
        } else if (!this.validInputs(charCode)) {
            this.disableEvent(event);
        }
    }

    private validInputs(keyCode: number): boolean {
        return this.keyboardService.isTab(keyCode)
            || this.keyboardService.isArrowKey(keyCode);
    }

    private focusOnSelectedWord() {
        const wordInfo = this.crossword.wordMap.get(this.selectedWord);
        this.focusOnSquare(wordInfo.i, wordInfo.j);
    }

    private focusOnSquare(i: number, j: number) {
        this.squares.toArray().find((e) => {
            return e.nativeElement.getAttribute('id') === `${i}_${j}`;
        }).nativeElement.focus();
    }

    private focusOnNextLetter(i: number, j: number) {
        const wordInfo = this.crossword.wordMap.get(this.selectedWord);
        const iEnd = wordInfo.horizontal ? wordInfo.i : wordInfo.i + wordInfo.word.length;
        const jEnd = wordInfo.horizontal ? wordInfo.j + wordInfo.word.length : wordInfo.j;
        if (wordInfo.horizontal) {
            if (j + 1 >= jEnd) {
                return;
            } else {
                j++;
            }
        } else {
            if (i + 1 >= iEnd) {
                return;
            } else {
                i++;
            }
        }
        this.focusOnSquare(i, j);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
