import { Injectable } from '@angular/core';

import { CrosswordService } from './crossword.service';
import { CrosswordHintsService } from './crossword-hints/crossword-hints.service';
import { CrosswordGridService } from './crossword-grid/crossword-grid.service';
import { CrosswordPointsService } from './crossword-points/crossword-points.service';

import { Word } from '../../../../commun/word';

@Injectable()
export class CrosswordGameService {
    // public attributes

    // private attributes

    constructor(
        private crosswordService: CrosswordService,
        private hintsService: CrosswordHintsService,
        private gridService: CrosswordGridService,
        private pointsService: CrosswordPointsService
    ) { }

    // public methods

    public async newGame(level: string) {
        await this.crosswordService.getCrossword(level).then((crossword) => {
            this.constructGame(crossword.crossword, crossword.wordsWithIndex, crossword.listOfWords);
        });
    }

    private constructGame(grid: string[][], wordsWithIndex: Array<Word>, listOfWords: Array<string>) {
        this.gridService.initialize(grid, wordsWithIndex);
        this.hintsService.newGame(wordsWithIndex);
        this.pointsService.newGame();
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
        this.hintsService.unselectHint();
    }

    public setSelectedWord(word: string) {
        const wordInfo = this.hintsService.getWordInfo(word);
        this.gridService.selectWord(wordInfo);
        this.hintsService.selectWord(word);
    }

    private checkIfWordsFound(i: number, j: number) {
        for (const word of this.gridService.grid[i][j].words) {
            const wordInfo = this.hintsService.getWordInfo(word);
            this.gridService.updateWordFoundStatus(wordInfo);
        }
    }
}
