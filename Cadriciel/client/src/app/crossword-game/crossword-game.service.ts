import { Injectable } from '@angular/core';

import { CrosswordService } from './crossword.service';
import { CrosswordHintsService } from './crossword-hints/crossword-hints.service';
import { CrosswordGridService } from './crossword-grid/crossword-grid.service';
import { CrosswordPointsService } from './crossword-points/crossword-points.service';
import { CrosswordWordsService } from './crossword-words.service';

import { Word } from '../../../../commun/word';
import { CrosswordDB } from '../../../../server/app/crosswordGrid/crosswordDB';

@Injectable()
export class CrosswordGameService {
    // public attributes

    // private attributes

    constructor(
        private crosswordService: CrosswordService,
        private hintsService: CrosswordHintsService,
        private gridService: CrosswordGridService,
        private pointsService: CrosswordPointsService,
        private wordsService: CrosswordWordsService
    ) {
        this.listenForWordSelections();
        this.listenForWordFoundAlerts();
    }

    // public methods

    public async newGame(level: string) {
        await this.crosswordService.getCrossword(level).then((crossword) => {
            this.constructGame(crossword.crossword, crossword.wordsWithIndex, crossword.listOfWords);
        });
    }

    public newMultiplayerGame(crosswordDB: CrosswordDB) {
        this.constructGame(crosswordDB.crossword, crosswordDB.wordsWithIndex, crosswordDB.listOfWords);
    }

    private constructGame(grid: string[][], wordsWithIndex: Array<Word>, listOfWords: Array<string>) {
        this.wordsService.newGame(wordsWithIndex);
        this.gridService.newGame(grid, wordsWithIndex);
        this.hintsService.newGame(wordsWithIndex);
        this.pointsService.newGame();
    }

    private listenForWordSelections() {
        this.hintsService.selectedWordAlerts()
            .subscribe((wordSelection) => {
                if (wordSelection.previous) {
                    const wordWithIndex = this.wordsService
                        .getWordWithIndex(wordSelection.previous);
                    this.gridService.unselectWord(wordWithIndex);
                }
                this.gridService.selectWord(wordSelection.current);
            });
    }

    private listenForWordFoundAlerts() {
        this.gridService.wordFoundAlerts()
            .subscribe((foundWord) => {
                this.hintsService.markHintAsFound(foundWord.word);
                this.pointsService.addToFoundWords(foundWord.word);
            });
    }
}
