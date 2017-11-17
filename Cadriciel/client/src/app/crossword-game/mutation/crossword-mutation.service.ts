import { Injectable } from '@angular/core';

import { CrosswordGridService } from '../grid/crossword-grid.service';
import { CrosswordHintsService } from '../hints/crossword-hints.service';
import { CrosswordCountdownService } from '../countdown/crossword-countdown.service';
import { CrosswordWordsService } from '../words/crossword-words.service';
import { CrosswordService } from '../crossword/crossword.service':

import { CrosswordSquare } from '../shared-classes/crossword-square';
import { Hint } from '../shared-classes/hint';
import { Word } from '../../../../../commun/word';

@Injectable()
export class CrosswordMutationService {
    public newGrid: CrosswordSquare[][];
    public newHints: Array<Hint>;
    public newWordMap: Map<string, Word>;

    constructor(
        private gridService: CrosswordGridService,
        private hintsService: CrosswordHintsService,
        private countdownService: CrosswordCountdownService,
        private wordsService: CrosswordWordsService,
        private crosswordService: CrosswordService
    ) { }

    public mutate() {

    }

    public updateMutation(foundWords: Array<Word>) {

    }
}
