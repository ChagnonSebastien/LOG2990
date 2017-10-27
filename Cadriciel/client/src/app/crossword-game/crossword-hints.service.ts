import { Injectable } from '@angular/core';

import { LexiconService } from './lexicon.service';

import { Hint } from './hint';
import { Word } from '../../../../commun/word';

@Injectable()
export class CrosswordHintsService {
    public hints: Array<Hint>;

    constructor(private lexiconService: LexiconService) { }

    public newGame(wordsWithIndex: Array<Word>) {
        this.hints = new Array<Hint>();
        for (const word of wordsWithIndex) {
            this.lexiconService.getWordDefinition(word.word)
                .then((definition) => {
                    this.hints.push(new Hint(word.word, definition));
                });
        }
    }
}
