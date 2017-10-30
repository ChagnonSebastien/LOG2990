import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CrosswordPointsService {
    private foundWords: Set<string>;
    private foundWordSubject: Subject<any>;

    constructor() {
        this.foundWordSubject = new Subject();
        this.newGame();
    }

    public newGame() {
        this.foundWords = new Set<string>();
    }

    public addToFoundWords(word: string) {
        this.foundWords.add(word);
        this.alertFoundWord(word);
    }

    public found(word: string): boolean {
        return this.foundWords.has(word);
    }

    public foundWordAlerts(): Observable<any> {
        return this.foundWordSubject.asObservable();
    }

    private alertFoundWord(word: string) {
        this.foundWordSubject.next(word);
    }
}
