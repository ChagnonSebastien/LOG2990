import { Injectable } from '@angular/core';

@Injectable()
export class CrosswordFoundWordsService {
    private foundWords: Set<string>;

    constructor() {
        this.newGame();
    }

    public newGame() {
        this.foundWords = new Set<string>();
    }

    public addToFoundWords(word: string) {
        this.foundWords.add(word);
    }

    public found(word: string): boolean {
        return this.foundWords.has(word);
    }
}
