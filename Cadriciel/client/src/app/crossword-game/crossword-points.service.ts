import { Injectable } from '@angular/core';

@Injectable()
export class CrosswordPointsService {
    private foundWords: Set<string>;

    constructor() { }

    public newGame() {
        this.foundWords = new Set<string>();
    }

    public foundWord(word: string) {
        this.foundWords.add(word);
    }

    public wordHasBeenFound(word: string): boolean {
        return this.foundWords.has(word);
    }
}
