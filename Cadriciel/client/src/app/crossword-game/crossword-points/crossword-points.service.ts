import { Injectable } from '@angular/core';

import { CrosswordWordsService } from '../crossword-words.service';

@Injectable()
export class CrosswordPointsService {
    public foundWords: Set<string>;
    public opponentFoundWords: Set<string>;

    constructor(private wordsService: CrosswordWordsService) {
        this.newGame();
    }

    public newGame() {
        this.foundWords = new Set<string>();
        this.opponentFoundWords = new Set<string>();
    }

    public addToFoundWords(word: string) {
        if (this.wordsService.hintExists(word) && !this.opponentFoundWords.has(word)) {
            this.foundWords.add(word);
        }
    }

    public addToOpponentFoundWords(word: string) {
        if (this.wordsService.hintExists(word) && !this.foundWords.has(word)) {
            this.opponentFoundWords.add(word);
        }
    }
}
