import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { CrosswordWordsService } from '../words/crossword-words.service';

@Injectable()
export class CrosswordPointsService {
    public foundWords: Set<string>;
    public opponentFoundWords: Set<string>;
    private gameCompleted: Subject<any>;

    constructor(private wordsService: CrosswordWordsService) {
        this.gameCompleted = new Subject();
        this.newGame();
    }

    public newGame(): void {
        this.foundWords = new Set<string>();
        this.opponentFoundWords = new Set<string>();
    }

    public addToFoundWords(word: string): boolean {
        if (this.wordsService.hintExists(word) && !this.opponentFoundWords.has(word)) {
            this.foundWords.add(word);
            this.checkIfGameIsDone();
            return true;
        }
        return false;
    }

    public addToOpponentFoundWords(word: string): boolean {
        if (this.wordsService.hintExists(word) && !this.foundWords.has(word)) {
            this.opponentFoundWords.add(word);
            this.checkIfGameIsDone();
            return true;
        }
        return false;
    }

    public gameCompletedAlerts(): Observable<any> {
        return this.gameCompleted.asObservable();
    }

    private checkIfGameIsDone(): boolean {
        if (this.gameIsDone()) {
            this.gameCompleted.next(true);
            return true;
        }
        return false;
    }

    private gameIsDone(): boolean {
        const numberOfWordsFound = this.foundWords.size + this.opponentFoundWords.size;
        return numberOfWordsFound === this.wordsService.numberOfWords();
    }
}
