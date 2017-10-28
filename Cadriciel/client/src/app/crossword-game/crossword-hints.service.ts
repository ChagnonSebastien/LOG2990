import { Injectable } from '@angular/core';

import { LexiconService } from './lexicon.service';
import { CrosswordGridService } from './crossword-grid.service';

import { Hint } from './hint';
import { Word } from '../../../../commun/word';

@Injectable()
export class CrosswordHintsService {
    public selectedWord: string;
    public hints: Array<Hint>;
    public wordMap: Map<string, Word>;

    constructor(private lexiconService: LexiconService, private gridService: CrosswordGridService) { }

    public newGame(wordsWithIndex: Array<Word>) {
        this.selectedWord = undefined;
        this.wordMap = this.constructWordMap(wordsWithIndex);
        this.hints = this.initializeHints(wordsWithIndex);
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

    private initializeHints(wordsWithIndex: Array<Word>): Array<Hint> {
        const hints = new Array<Hint>();
        for (const word of wordsWithIndex) {
            this.lexiconService.getWordDefinition(word.word)
                .then((definition) => {
                    hints.push(new Hint(word.word, definition));
                });
        }
        return hints;
    }
}
