import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { LexiconService } from '../lexicon/lexicon.service';
import { CrosswordWordsService } from '../words/crossword-words.service';

import { Hint } from '../shared-classes/hint';
import { Word } from '../../../../../commun/word';

@Injectable()
export class CrosswordHintsService {
    public selectedWord: string;
    public opponentSelectedWord: string;
    public hints: Array<Hint>;
    private selectedWordSubject: Subject<any>;

    constructor(
        private lexiconService: LexiconService,
        private wordsService: CrosswordWordsService,
    ) {
        this.selectedWordSubject = new Subject();
    }

    public selectedWordAlerts(): Observable<any> {
        return this.selectedWordSubject.asObservable();
    }

    public async newGame(wordsWithIndex: Array<Word>): Promise<boolean> {
        this.selectedWord = undefined;
        this.opponentSelectedWord = undefined;
        return this.initializeHints(wordsWithIndex);
    }

    public selectWord(word: string): boolean {
        const wordWithIndex = this.wordsService.getWordWithIndex(word);
        if (wordWithIndex === undefined || this.selectedWord === word) {
            return false;
        }
        this.alertNewSelectedWord(wordWithIndex);
        this.selectedWord = word;
        return true;
    }

    public unselectHint() {
        this.selectedWord = undefined;
    }

    public markHintAsFound(word: string): boolean {
        if (this.selectedWord === word && this.wordsService.hintExists(word)) {
            const foundHint = this.hints.find((hint) => {
                return hint.word === word;
            });
            if (foundHint !== undefined) {
                this.unselectHint();
                this.opponentSelectedWord = undefined;
                foundHint.found = true;
                return true;
            }
        }
        return false;
    }

    public markHintAsFoundByOpponent(word: string): boolean {
        if (this.wordsService.hintExists(word)) {
            const foundHint = this.hints.find((hint) => {
                return hint.word === word;
            });
            if (foundHint !== undefined) {
                if (this.selectedWord === word) {
                    this.unselectHint();
                }
                this.opponentSelectedWord = undefined;
                foundHint.opponentFound = true;
                return true;
            }
        }
        return false;
    }

    private async initializeHints(wordsWithIndex: Array<Word>): Promise<boolean> {
        this.hints = new Array<Hint>();
        let result: boolean;
        await this.lexiconService.getWordDefinitions(
            wordsWithIndex.map(wordWithIndex => wordWithIndex.word)
        ).subscribe((definitions) => {
            definitions.map((definition, i) => {
                this.hints.push(new Hint(wordsWithIndex[i].word, definition));
            });
            result = true;
        });
        return result;
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
