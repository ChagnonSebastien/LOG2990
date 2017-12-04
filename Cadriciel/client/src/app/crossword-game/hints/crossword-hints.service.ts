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
    public selectedWordSubject: Subject<any>;

    constructor(
        private lexiconService: LexiconService,
        private wordsService: CrosswordWordsService,
    ) {
        this.selectedWordSubject = new Subject();
    }

    public selectedWordAlerts(): Observable<any> {
        return this.selectedWordSubject.asObservable();
    }

    public async newGame(wordsWithIndex: Array<Word>): Promise<void> {
        this.selectedWord = undefined;
        this.opponentSelectedWord = undefined;
        await this.initializeHints(wordsWithIndex).then((hints) => {
            this.hints = hints;
        });
    }

    public endGame() {
        this.selectedWord = undefined;
        this.opponentSelectedWord = undefined;
        this.hints = undefined;
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

    public deselectHint(): boolean {
        this.selectedWord = undefined;
        return true;
    }

    public markHintAsFound(word: string): boolean {
        if (this.selectedWord === word && this.wordsService.hintExists(word)) {
            const foundHint = this.hints.find((hint) => {
                return hint.word === word;
            });
            if (foundHint !== undefined) {
                this.deselectHint();
                if (this.opponentSelectedWord === foundHint.word) {
                    this.opponentSelectedWord = undefined;
                }
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
                    this.deselectHint();
                }
                this.opponentSelectedWord = undefined;
                foundHint.opponentFound = true;
                return true;
            }
        }
        return false;
    }

    public async initializeHints(wordsWithIndex: Array<Word>): Promise<Array<Hint>> {
        const hints = new Array<Hint>();
        await this.lexiconService.getWordDefinitions(
            wordsWithIndex.map(wordWithIndex => wordWithIndex.word)
        ).subscribe((definitions) => {
            definitions.map((definition, i) => {
                hints.push(new Hint(wordsWithIndex[i].word, definition));
            });
        });
        return hints;
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
