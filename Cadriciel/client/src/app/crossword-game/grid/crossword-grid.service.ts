import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { WordUtilities } from '../utilities/word-utilities';

import { KeyboardService } from '../keyboard/keyboard.service';

import { CrosswordSquare } from '../shared-classes/crossword-square';
import { Word } from '../../../../../commun/word';

@Injectable()
export class CrosswordGridService {
    public grid: CrosswordSquare[][];
    private wordFoundSubject: Subject<any>;

    constructor(
        private keyboardService: KeyboardService
    ) {
        this.wordFoundSubject = new Subject();
        this.listenForLetterInputs();
        this.listenForBackspaces();
    }

    public newGame(grid: string[][], wordsWithIndex: Array<Word>) {
        this.initializeGrid(grid);
        this.initializeWordsUsingSquare(wordsWithIndex);
    }

    public wordFoundAlerts(): Observable<any> {
        return this.wordFoundSubject.asObservable();
    }

    private listenForLetterInputs() {
        this.keyboardService.letterInputAlerts()
            .subscribe((input) => {
                this.insertLetter(input.letter, input.i, input.j);
                this.checkIfWordsFound(input.i, input.j);
            });
    }

    private checkIfWordsFound(i: number, j: number) {
        if (this.canInsertOrErase(i, j)) {
            for (const word of this.grid[i][j].words) {
                this.updateWordFoundStatus(word);
            }
        }
    }

    private listenForBackspaces() {
        this.keyboardService.backspaceAlerts()
            .subscribe((square) => {
                this.eraseLetter(square.i, square.j);
            });
    }

    public updateWordFoundStatus(word: Word) {
        if (this.wordFound(word)) {
            this.wordFoundSubject.next(word);
            this.markWordAsFound(word);
        }
    }

    private insertLetter(letter: string, i: number, j: number) {
        if (this.canInsertOrErase(i, j)) {
            this.grid[i][j].input = letter;
        }
    }

    private eraseLetter(i: number, j: number) {
        if (this.canInsertOrErase(i, j)) {
            this.grid[i][j].input = '';
        }
    }

    private canInsertOrErase(i: number, j: number): boolean {
        const square = this.grid[i][j];
        return !square.found && !square.opponentFound && !square.black && square.selected;
    }

    public unselectWord() {
        for (const row of this.grid) {
            for (const square of row) {
                square.selected = false;
            }
        }
    }

    public unselectWordOpponent() {
        for (const row of this.grid) {
            for (const square of row) {
                square.opponentSelected = false;
            }
        }
    }

    public selectWord(word: Word) {
        WordUtilities.forEachLetter(word, this.selectSquare.bind(this));
    }

    public selectWordOpponent(word: Word) {
        WordUtilities.forEachLetter(word, this.selectSquareOpponent.bind(this));
    }

    public markWordAsFoundByOpponent(word: Word) {
        WordUtilities.forEachLetter(word, this.markSquareAsFoundByOpponent.bind(this));
    }

    private markWordAsFound(word: Word) {
        WordUtilities.forEachLetter(word, this.markSquareAsFound.bind(this));
        this.unselectWord();
    }

    private initializeGrid(grid: string[][]) {
        this.grid = grid.map((row) => {
            return row.map((square) => {
                return new CrosswordSquare(square);
            });
        });
    }

    private initializeWordsUsingSquare(wordsWithIndex: Array<Word>) {
        for (const word of wordsWithIndex) {
            for (let k = 0; k < word.word.length; k++) {
                const i = word.horizontal ? word.i : word.i + k;
                const j = word.horizontal ? word.j + k : word.j;
                this.grid[i][j].words.push(word);
            }
        }
    }

    private wordFound(word: Word): boolean {
        for (let k = 0; k < word.word.length; k++) {
            const i = word.horizontal ? word.i : word.i + k;
            const j = word.horizontal ? word.j + k : word.j;
            if (!this.grid[i][j].letterFound()) {
                return false;
            }
        }
        return true;
    }

    private selectSquare(i: number, j: number) {
        if (!this.grid[i][j].found) {
            this.grid[i][j].selected = true;
        }
    }

    private selectSquareOpponent(i: number, j: number) {
        if (!this.grid[i][j].found) {
            this.grid[i][j].opponentSelected = true;
        }
    }

    private markSquareAsFound(i: number, j: number) {
        this.grid[i][j].found = true;
        this.grid[i][j].selected = false;
        this.grid[i][j].opponentSelected = false;
    }

    private markSquareAsFoundByOpponent(i: number, j: number) {
        this.grid[i][j].opponentFound = true;
        this.grid[i][j].input = this.grid[i][j].answer;
        this.grid[i][j].selected = false;
        this.grid[i][j].opponentSelected = false;
    }
}
