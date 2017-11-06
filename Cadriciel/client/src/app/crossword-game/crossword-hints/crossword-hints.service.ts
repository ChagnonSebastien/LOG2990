import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { LexiconService } from '../lexicon.service';

import { Hint } from '../shared-classes/hint';
import { Word } from '../../../../../commun/word';

@Injectable()
export class CrosswordHintsService {
    public selectedWord: string;
    private selectedWordSubject: Subject<any>;
    public hints: Array<Hint>;
    private wordMap: Map<string, Word>;

    constructor(
        private lexiconService: LexiconService,
    ) {
        this.selectedWordSubject = new Subject();
    }

    public selectedWordAlerts(): Observable<any> {
        return this.selectedWordSubject.asObservable();
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
        const wordWithIndex = this.wordMap.get(word);
        if (wordWithIndex === undefined || this.selectedWord === word) {
            return;
        }
        this.alertNewSelectedWord(wordWithIndex);
        this.selectedWord = word;
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
        this.lexiconService.getWordDefinitions(
            wordsWithIndex.map(wordWithIndex => wordWithIndex.word)
        ).subscribe((definitions) => {
            definitions.map((definition, i) => {
                this.hints.push(new Hint(wordsWithIndex[i].word, definition));
            });
        });
    }

    private alertNewSelectedWord(word: Word) {
        this.selectedWordSubject.next(
            {
                'previous': this.selectedWord,
                'current': word
            }
        );
    }
}
