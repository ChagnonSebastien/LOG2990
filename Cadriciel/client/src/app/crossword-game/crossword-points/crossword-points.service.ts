import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { CrosswordWordsService } from '../crossword-words.service';

@Injectable()
export class CrosswordPointsService {
    public foundWords: Set<string>;
    public opponentFoundWords: Set<string>;
    private gameCompleted: Subject<any>;

    constructor(private wordsService: CrosswordWordsService) {
        this.gameCompleted = new Subject();
        this.newGame();
    }

    public gameCompletedAlerts(): Observable<any> {
        return this.gameCompleted.asObservable();
    }

    public newGame() {
        this.foundWords = new Set<string>();
        this.opponentFoundWords = new Set<string>();
    }

    public addToFoundWords(word: string) {
        if (this.wordsService.hintExists(word) && !this.opponentFoundWords.has(word)) {
            this.foundWords.add(word);
            this.checkIfGameIsDone();
        }
    }

    public addToOpponentFoundWords(word: string) {
        if (this.wordsService.hintExists(word) && !this.foundWords.has(word)) {
            this.opponentFoundWords.add(word);
            this.checkIfGameIsDone();
        }
    }

    private checkIfGameIsDone() {
        if (this.gameIsDone()) {
            this.gameCompleted.next(true);
        }
    }

    private gameIsDone(): boolean {
        const numberOfWordsFound = this.foundWords.size + this.opponentFoundWords.size;
        return numberOfWordsFound === this.wordsService.numberOfWords();
    }
}
