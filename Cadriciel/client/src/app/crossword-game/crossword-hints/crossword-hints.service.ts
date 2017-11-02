import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { LexiconService } from '../lexicon.service';
import { CrosswordGridService } from '../crossword-grid/crossword-grid.service';
import { CrosswordPointsService } from '../crossword-points/crossword-points.service';

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
        private gridService: CrosswordGridService,
        private pointsService: CrosswordPointsService
    ) {
        this.subscribeToFoundWordAlerts();
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
        if (wordWithIndex === undefined) {
            return;
        }
        if (this.selectedWord) {
            this.gridService.unselectWord(this.wordMap.get(this.selectedWord));
        }
        this.selectedWord = word;
        this.gridService.selectWord(wordWithIndex);
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

    private subscribeToFoundWordAlerts() {
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
}
