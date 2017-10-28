import { Injectable } from '@angular/core';

import { LexiconService } from './lexicon.service';

import { Hint } from './hint';
import { Word } from '../../../../commun/word';

@Injectable()
export class CrosswordHintsService {
    public hints: Array<Hint>;
    public wordsWithIndex: Array<Word>;
    public wordMap: Map<string, Word>;

    constructor(private lexiconService: LexiconService) { }

    public newGame(wordsWithIndex: Array<Word>) {
        this.wordsWithIndex = wordsWithIndex;
        this.wordMap = this.constructWordMap();
        this.hints = new Array<Hint>();
        for (const word of wordsWithIndex) {
            this.lexiconService.getWordDefinition(word.word)
                .then((definition) => {
                    this.hints.push(new Hint(word.word, definition));
                });
        }
    }

    public getWordInfo(word: string): Word {
        return this.wordMap.get(word);
    }

    // Provide O(1) access to information on a word.
    private constructWordMap(): Map<string, Word> {
        return this.wordsWithIndex.reduce((map, obj) => {
            map.set(obj.word, obj);
            return map;
        }, new Map<string, Word>());
    }
}
