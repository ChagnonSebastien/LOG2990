import { Injectable } from '@angular/core';

import { CrosswordGridService } from '../grid/crossword-grid.service';
import { CrosswordHintsService } from '../hints/crossword-hints.service';
import { CrosswordCountdownService } from '../countdown/crossword-countdown.service';
import { CrosswordWordsService } from '../words/crossword-words.service';
import { CrosswordService } from '../crossword/crossword.service';
import { CrosswordConfigurationService } from '../configuration/crossword-configuration.service';
import { CrosswordPointsService } from '../points/crossword-points.service';

import { Utilities } from '../../../../../server/app/utilities';

import { CrosswordSquare } from '../shared-classes/crossword-square';
import { Hint } from '../shared-classes/hint';
import { Word } from '../../../../../commun/word';
import { Crossword } from '../../../../../commun/crossword/crossword';

@Injectable()
export class CrosswordMutationService {
    public newGrid: CrosswordSquare[][];
    public newHints: Array<Hint>;
    public wordsWithIndex: Array<Word>;

    constructor(
        private gridService: CrosswordGridService,
        private hintsService: CrosswordHintsService,
        private countdownService: CrosswordCountdownService,
        private wordsService: CrosswordWordsService,
        private crosswordService: CrosswordService,
        private configurationService: CrosswordConfigurationService,
        private pointsService: CrosswordPointsService
    ) { }

    public mutate() {
        this.mutateWordsService();
        this.mutateGridService();
        this.mutateHintsService();

        this.updateMutation();
    }

    public updateMutation() {
        const foundWords = this.pointsService.getFoundWords();
        this.crosswordService.getMutatedCrossword(
            this.configurationService.level,
            foundWords
        ).then((mutatedCrossword) => {
            this.wordsWithIndex = mutatedCrossword.wordsWithIndex;
            this.newGrid = this.updateGrid(mutatedCrossword.crossword, this.wordsWithIndex);
            this.hintsService.initializeHints(this.wordsWithIndex).then((hints) => {
                this.newHints = hints;
            });
        });
    }

    public async updateMultiplayerMutation(crossword: Crossword): Promise<void> {
        this.wordsWithIndex = crossword.wordsWithIndex;
        this.newGrid = this.updateGrid(crossword.crossword, this.wordsWithIndex);
        this.newHints = await this.hintsService
            .initializeHints(this.wordsWithIndex);
    }

    public mutateMultiplayer() {
        console.log(this.wordsWithIndex);
        this.mutateWordsService();
        console.log(this.newGrid);
        this.mutateGridService();
        console.log(this.newHints);
        this.mutateHintsService();
    }

    private updateGrid(grid: string[][], wordsWithIndex: Array<Word>): CrosswordSquare[][] {
        return this.gridService.initializeGrid(grid, wordsWithIndex);
    }

    private mutateWordsService() {
        this.wordsService.newGame(this.wordsWithIndex);
    }

    private mutateGridService() {
        this.gridService.grid = this.newGrid.map((row, i) => {
            return row.map((square, j) => {
                if (this.gridService.grid[i][j].found) {
                    square.found = true;
                    square.input = square.answer;
                }
                if (this.gridService.grid[i][j].opponentFound) {
                    square.opponentFound = true;
                    square.input = square.answer;
                }
                return square;
            });
        });
    }

    private mutateHintsService() {
        this.hintsService.hints = this.newHints.map((hint) => {
            console.log(hint);
            if (this.pointsService.foundWords.has(hint.word)) {
                hint.found = true;
            } else if (this.pointsService.opponentFoundWords.has(hint.word)) {
                hint.opponentFound = true;
            }
            return hint;
        });
        this.hintsService.selectedWord = undefined;
        this.hintsService.opponentSelectedWord = undefined;
    }
}
