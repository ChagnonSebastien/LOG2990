import { Injectable } from '@angular/core';

import { CrosswordService } from './crossword.service';
import { CrosswordHintsService } from './crossword-hints.service';
import { CrosswordGridService } from './crossword-grid.service';

import { Word } from '../../../../commun/word';
import { CrosswordSquare } from './crossword-square';

@Injectable()
export class CrosswordGameService {
    // public attributes
    public timer: number;
    public wordsWithIndex: Array<Word>;
    public wordMap: Map<string, Word>;

    // private attributes

    private size: number;
    private grid: string[][];
    private foundWords: Set<string>;
    private gridWords: Array<string>[][];
    private status: CrosswordSquare[][];

    constructor(
        private crosswordService: CrosswordService,
        private hintsService: CrosswordHintsService,
        private gridService: CrosswordGridService
    ) { }

    // public methods

    public async newGame(level: string) {
        await this.crosswordService.getCrossword(level).then((crossword) => {
            this.constructGame(crossword.crossword, crossword.wordsWithIndex, crossword.listOfWords);
        });
    }

    private constructGame(grid: string[][], wordsWithIndex: Array<Word>, listOfWords: Array<string>) {
        this.gridService.initializeGrid(grid);
        this.hintsService.newGame(wordsWithIndex);
        this.foundWords = new Set<string>();
        this.timer = 60;
        setInterval(this.decrementTimer.bind(this), 1000);
    }

    public getTimer(): number {
        return this.timer;
    }

    public getStatus(): CrosswordSquare[][] {
        return this.status;
    }

    public insertLetter(charCode: number, i: number, j: number) {
        const letter = String.fromCharCode(charCode).toLowerCase();
        this.gridService.insertLetter(letter, i, j);
        if (this.gridService.grid[i][j].letterFound()) {
            this.checkIfWordsFound(i, j);
        }
    }

    public eraseLetter(i: number, j: number) {
        this.gridService.eraseLetter(i, j);
    }

    public clearSelectedWord(word: string) {
        const wordInfo = this.hintsService.getWordInfo(word);
        this.gridService.unselectWord(wordInfo);
    }

    public setSelectedWord(word: string) {
        const wordInfo = this.hintsService.getWordInfo(word);
        this.gridService.selectWord(wordInfo);
    }

    private decrementTimer() {
        if (this.timer > 0) {
            this.timer--;
        }
    }

    // used by constructor

    // For each square, a list of words that contributed a letter to that square.
    private initializeGridWords(): Array<string>[][] {
        return this.wordsWithIndex.reduce((gridWords, word) => {
            return this.insertWordIntoGridWords(gridWords, word);
        }, this.blankGridWords());
    }

    // initializeGridWords() helper function.
    private blankGridWords(): Array<string>[][] {
        return new Array(this.size).fill(undefined).map(res => {
            return new Array(this.size).fill(undefined).map(u => {
                return new Array<string>();
            });
        });
    }

    // initializeGridWords() helper: inserts the word at each square it contributes to.
    private insertWordIntoGridWords(gridWords: Array<string>[][], word: Word): Array<string>[][] {
        for (let k = 0; k < word.word.length; k++) {
            const i = word.horizontal ? word.i : word.i + k;
            const j = word.horizontal ? word.j + k : word.j;
            gridWords[i][j].push(word.word);
        }
        return gridWords;
    }

    // helper methods

    private checkIfWordsFound(i: number, j: number) {
        for (const word of this.gridWords[i][j]) {
            const wordInfo = this.hintsService.getWordInfo(word);
            this.gridService.updateWordFoundStatus(wordInfo);
        }
    }
}
