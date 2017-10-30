import { Injectable } from '@angular/core';

import { CrosswordPointsService } from '../crossword-points/crossword-points.service';

import { CrosswordSquare } from '../shared-classes/crossword-square';
import { Word } from '../../../../../commun/word';

@Injectable()
export class CrosswordGridService {
    public size: number;
    public grid: CrosswordSquare[][];

    constructor(private pointsService: CrosswordPointsService) { }

    public initializeGrid(grid: string[][], wordsWithIndex: Array<Word>) {
        this.size = grid.length;
        this.grid = grid.map((row) => {
            return row.map((square) => {
                return new CrosswordSquare(square);
            });
        });

        for (const word of wordsWithIndex) {
            for (let k = 0; k < word.word.length; k++) {
                const i = word.horizontal ? word.i : word.i + k;
                const j = word.horizontal ? word.j + k : word.j;
                this.grid[i][j].words.push(word.word);
            }
        }
    }

    public updateWordFoundStatus(word: Word) {
        for (let k = 0; k < word.word.length; k++) {
            const i = word.horizontal ? word.i : word.i + k;
            const j = word.horizontal ? word.j + k : word.j;
            if (!this.grid[i][j].letterFound()) {
                return; // word not found
            }
        }
        // word is found
        this.markWordAsFound(word);
    }

    public insertLetter(letter: string, i: number, j: number) {
        // only insert when not found and not black
        if (!this.grid[i][j].found && !this.grid[i][j].black) {
            this.grid[i][j].input = letter;
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

    public markWordAsFound(word: Word) {
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
