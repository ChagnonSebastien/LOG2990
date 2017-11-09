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

    public newGame(grid: string[][], wordsWithIndex: Array<Word>): boolean {
        this.initializeGrid(grid);
        this.initializeWordsUsingSquare(wordsWithIndex);
        return true;
    }

    public wordFoundAlerts(): Observable<any> {
        return this.wordFoundSubject.asObservable();
    }

    public unselectWord(): void {
        for (const row of this.grid) {
            for (const square of row) {
                square.selected = false;
            }
        }
    }

    public unselectWordOpponent(): void {
        for (const row of this.grid) {
            for (const square of row) {
                square.opponentSelected = false;
            }
        }
    }

    public selectWord(word: Word): void {
        WordUtilities.forEachLetter(word, this.selectSquare.bind(this));
    }

    public selectWordOpponent(word: Word): void {
        WordUtilities.forEachLetter(word, this.selectSquareOpponent.bind(this));
    }

    public markWordAsFoundByOpponent(word: Word): void {
        WordUtilities.forEachLetter(word, this.markSquareAsFoundByOpponent.bind(this));
    }

    private listenForLetterInputs(): void {
        this.keyboardService.letterInputAlerts()
            .subscribe((input) => {
                this.insertLetter(input.letter, input.i, input.j);
                this.checkIfWordsFound(input.i, input.j);
            });
    }

    private listenForBackspaces(): void {
        this.keyboardService.backspaceAlerts()
            .subscribe((square) => {
                this.eraseLetter(square.i, square.j);
            });
    }

    private checkIfWordsFound(i: number, j: number): boolean {
        if (this.canInsertOrErase(i, j)) {
            return this.grid[i][j].words.map((word) => {
                return this.updateWordFoundStatus(word);
            }).reduce((previous, current) => {
                return previous || current;
            });
        }
    }

    private updateWordFoundStatus(word: Word): boolean {
        if (this.wordFound(word)) {
            this.wordFoundSubject.next(word);
            this.markWordAsFound(word);
            return true;
        }
        return false;
    }

    private insertLetter(letter: string, i: number, j: number): boolean {
        if (this.canInsertOrErase(i, j)) {
            this.grid[i][j].input = letter;
            return true;
        }
    }

    private eraseLetter(i: number, j: number): boolean {
        if (this.canInsertOrErase(i, j)) {
            this.grid[i][j].input = '';
            return true;
        }
        return false;
    }

    private canInsertOrErase(i: number, j: number): boolean {
        const square = this.grid[i][j];
        return !square.found && !square.opponentFound && !square.black && square.selected;
    }

    private markWordAsFound(word: Word): void {
        WordUtilities.forEachLetter(word, this.markSquareAsFound.bind(this));
        this.unselectWord();
    }

    private initializeGrid(grid: string[][]): boolean {
        this.grid = grid.map((row) => {
            return row.map((square) => {
                return new CrosswordSquare(square);
            });
        });
        return true;
    }

    private initializeWordsUsingSquare(wordsWithIndex: Array<Word>): boolean {
        for (const word of wordsWithIndex) {
            for (let k = 0; k < word.word.length; k++) {
                const i = word.horizontal ? word.i : word.i + k;
                const j = word.horizontal ? word.j + k : word.j;
                this.grid[i][j].words.push(word);
            }
        }
        return true;
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

    private selectSquare(i: number, j: number): boolean {
        if (!this.grid[i][j].found && !this.grid[i][j].opponentFound) {
            this.grid[i][j].selected = true;
            return true;
        }
        return false;
    }

    private selectSquareOpponent(i: number, j: number): boolean {
        if (!this.grid[i][j].found && !this.grid[i][j].opponentFound) {
            this.grid[i][j].opponentSelected = true;
            return true;
        }
        return false;
    }

    private markSquareAsFound(i: number, j: number): void {
        this.grid[i][j].found = true;
        this.grid[i][j].selected = false;
        this.grid[i][j].opponentSelected = false;
    }

    private markSquareAsFoundByOpponent(i: number, j: number): void {
        this.grid[i][j].opponentFound = true;
        this.grid[i][j].input = this.grid[i][j].answer;
        this.grid[i][j].selected = false;
        this.grid[i][j].opponentSelected = false;
    }
}
