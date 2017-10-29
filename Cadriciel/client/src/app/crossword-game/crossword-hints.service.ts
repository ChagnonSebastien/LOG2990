import { Injectable } from '@angular/core';

import { LexiconService } from './lexicon.service';
import { CrosswordGridService } from './crossword-grid.service';
import { CrosswordPointsService } from './crossword-points.service';

import { Hint } from './hint';
import { Word } from '../../../../commun/word';

@Injectable()
export class CrosswordHintsService {
    public selectedWord: string;
    public hints: Array<Hint>;
    public wordMap: Map<string, Word>;

    constructor(
        private lexiconService: LexiconService,
        private gridService: CrosswordGridService,
        private pointsService: CrosswordPointsService
    ) {
        this.pointsService.foundWordAlerts()
            .subscribe((newlyFoundWord) => {
                this.hints.find((value) => {
                    return value.word === newlyFoundWord;
                }).found = true;
                if (newlyFoundWord === this.selectedWord) {
                    this.unselectHint();
                }
            });
    }

    public newGame(wordsWithIndex: Array<Word>) {
        this.selectedWord = undefined;
        this.wordMap = this.constructWordMap(wordsWithIndex);
        this.initializeHints(wordsWithIndex);
    }

    public getWordInfo(word: string): Word {
        return this.wordMap.get(word);
    }

    public selectWord(word: string) {
        if (this.selectedWord) {
            this.gridService.unselectWord(this.wordMap.get(this.selectedWord));
        }
        this.selectedWord = word;
        this.gridService.selectWord(this.wordMap.get(word));
    }

    public unselectHint() {
        this.selectedWord = undefined;
    }

    private constructWordMap(wordsWithIndex: Array<Word>): Map<string, Word> {
        return wordsWithIndex.reduce((map, obj) => {
            map.set(obj.word, obj);
            return map;
        }, new Map<string, Word>());
    }

    private initializeHints(wordsWithIndex: Array<Word>) {
        this.hints = new Array<Hint>();
        this.lexiconService.getWordDefinitions(wordsWithIndex.map(word => word.word))
            .subscribe((definitions) => {
                definitions.map((definition, i) => {
                    this.hints.push(new Hint(wordsWithIndex[i].word, definition));
                });
            });
    }
}
