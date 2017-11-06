import { Injectable } from '@angular/core';

import { CrosswordPointsService } from '../crossword-points/crossword-points.service';

import { CrosswordSquare } from '../shared-classes/crossword-square';
import { Word } from '../../../../../commun/word';

@Injectable()
export class CrosswordGridService {
    public grid: CrosswordSquare[][];

    constructor(private pointsService: CrosswordPointsService) { }

    public initialize(grid: string[][], wordsWithIndex: Array<Word>) {
        this.initializeGrid(grid);
        this.initializeWordsUsingSquare(wordsWithIndex);
    }

    public updateWordFoundStatus(word: Word) {
        if (this.wordFound(word)) {
            this.markWordAsFound(word);
        }
    }

    public insertLetter(letter: string, i: number, j: number) {
        // only insert when not found and not black
        if (!this.grid[i][j].found && !this.grid[i][j].black) {
            this.grid[i][j].input = letter.toLowerCase();
        }
    }

    public eraseLetter(i: number, j: number) {
        // only erase when not found and not black
        if (!this.grid[i][j].found && !this.grid[i][j].black) {
            this.grid[i][j].input = '';
        }
    }

    public unselectWord(word: Word) {
        this.forEachLetter(word, this.unselectSquare.bind(this));
    }

    public selectWord(word: Word) {
        this.forEachLetter(word, this.selectSquare.bind(this));
    }

    private markWordAsFound(word: Word) {
        this.forEachLetter(word, this.markSquareAsFound.bind(this));
        this.unselectWord(word);
        this.pointsService.addToFoundWords(word.word);
    }

    private forEachLetter(word: Word, callback) {
        for (let k = 0; k < word.word.length; k++) {
            const i = word.horizontal ? word.i : word.i + k;
            const j = word.horizontal ? word.j + k : word.j;
            callback(i, j);
        }
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
                this.grid[i][j].words.push(word.word);
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

    private unselectSquare(i: number, j: number) {
        this.grid[i][j].selected = false;
    }

    private selectSquare(i: number, j: number) {
        this.grid[i][j].selected = true;
    }

    private markSquareAsFound(i: number, j: number) {
        this.grid[i][j].found = true;
    }
}
