import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CrosswordPointsService {
    private foundWords: Set<string>;
    private foundWord: Subject<any>;

    constructor() {
        this.foundWord = new Subject();
        this.newGame();
    }

    public newGame() {
        this.foundWords = new Set<string>();
    }

    public addToFoundWords(word: string) {
        this.foundWords.add(word);
        this.foundWord.next(word);
    }

    public found(word: string): boolean {
        return this.foundWords.has(word);
    }

    public foundWordAlerts(): Observable<any> {
        return this.foundWord.asObservable();
    }
}
