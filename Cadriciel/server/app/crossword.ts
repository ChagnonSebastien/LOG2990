import { Utilities } from './utilities';
import { Lexicon } from './lexicon';
import * as path from 'path';

const lexiconPath = path.join(__dirname, '..', 'app', 'words.json');

export class CrosswordGenerator {
    public id: string;
    public difficulty: string;
    public size: number;
    public grid: string[][];
    public previousGridState: string[][];
    public gridCounter: number[][];
    public previousGridCounter: number[][];
    public lexicon: Lexicon;
    public words: Set<string>;

    constructor(size: number) {
        this.size = size;
        this.words = new Set<string>();
        this.grid = this.newGrid(size, ' ');
        this.gridCounter = this.newGrid(size, 0);
        this.saveState();
        this.loadLexicon(lexiconPath);
    }

    public newGrid(size: number, fill: any): Array<any> {
        return new Array(size).fill(null).map(res => {
            const line = new Array(size).fill(null).map(u => {
                return fill;
            });
            return line;
        });
    }

    public loadLexicon(file: string) {
        this.lexicon = new Lexicon(lexiconPath);
    }

    public indexOutOfBounds(i: number): boolean {
        return i < 0 || i >= this.size;
    }

    public indexesOutOfBounds(i: number, j: number): boolean {
        return this.indexOutOfBounds(i) || this.indexOutOfBounds(j);
    }

    public addLetter(i: number, j: number, letter: string): boolean {
        if (letter.length !== 1 || this.indexesOutOfBounds(i, j)) {
            return false;
        }
        if (this.grid[i][j] !== ' ' && this.grid[i][j] !== letter) {
            return false;
        }
        this.grid[i][j] = letter;
        this.gridCounter[i][j]++;
        return true;
    }

    public addWord(i: number, j: number, word: string, horizontal: boolean): boolean {
        if (this.words.has(word)) {
            return false;
        }

        this.saveState();
        if (!this.addBlackSquares(i, j, word, horizontal)) {
            this.rollback();
            return false;
        }
        for (const letter of word) {
            if (!this.addLetter(i, j, letter)) {
                this.rollback();
                return false;
            } else {
                i = horizontal ? i : i + 1;
                j = horizontal ? j + 1 : j;
            }
        }
        this.words.add(word);
        return true;
    }

    public addSpacing(i: number, j: number, horizontal: boolean): boolean {
        if (this.indexesOutOfBounds(i, j)) {
            return false;
        }
        if (horizontal && this.grid[i][j] === ' ') {
            return this.addLetter(i, j, '-');
        } else if (!horizontal && this.grid[i][j] === ' ') {
            return this.addLetter(i, j, '|');
        }
        return false;
    }

    public addBlackSquares(i: number, j: number, word: string, horizontal: boolean): boolean {
        if (horizontal) {
            if (j > 0) {
                if (!this.addLetter(i, j - 1, '#')) {
                    return false;
                }
            }
            if (j + word.length < this.size) {
                if (!this.addLetter(i, j + word.length, '#')) {
                    return false;
                }
            }
        } else {
            if (i > 0) {
                if (!this.addLetter(i - 1, j, '#')) {
                    return false;
                }
            }
            if (i + word.length < this.size) {
                if (!this.addLetter(i + word.length, j, '#')) {
                    return false;
                }
            }
        }
        return true;
    }

    public addHorizontalSpacing(i: number, j: number, word: string): boolean {
        return false;
    }

    public deleteLetter(i: number, j: number, letter: string): boolean {
        if (letter.length !== 1 || this.indexesOutOfBounds(i, j)) {
            return false;
        }
        if (this.grid[i][j] !== letter) {
            return false;
        }
        if (this.gridCounter[i][j] > 1) {
            this.gridCounter[i][j]--;
        } else {
            this.gridCounter[i][j] = 0;
            this.grid[i][j] = ' ';
        }
        return true;
    }

    public deleteWord(i: number, j: number, word: string, horizontal: boolean): boolean {
        if (!this.words.has(word)) {
            return false;
        }
        this.saveState();
        for (const letter of word) {
            if (!this.deleteLetter(i, j, letter)) {
                this.rollback();
                return false;
            } else {
                i = horizontal ? i : i + 1;
                j = horizontal ? j + 1 : j;
            }
        }

        this.words.delete(word);
        return true;
    }

    public scoreWord(word: string, pattern: string): number {
        let score = 0;
        for (let i = 0; i < word.length; i++) {
            score = word[i] === pattern[i] ? score + 1 : score;
        }
        return score;
    }

    public bestInsertIndex(word: string, pattern: string): number {
        let insertIndex = 0;
        let maxScore = 0;
        for (let index = 0; index < pattern.length - word.length + 1; index++) {
            const score = this.scoreWord(word, pattern.substr(index, word.length));
            if (score > maxScore) {
                insertIndex = index;
                maxScore = score;
            }
        }
        return insertIndex;
    }

    public patternForLine(i: number, horizontal: boolean) {
        if (horizontal) {
            return this.grid[i].join('');
        } else {
            let pattern = '';
            for (let index = 0; index < this.size; index++) {
                pattern += this.grid[index][i];
            }
            return pattern;
        }
    }

    public addRandomWord(i: number, horizontal: boolean): boolean {
        const pattern = this.patternForLine(i, horizontal);
        const wordsForPattern = this.lexicon.wordsForPattern(pattern);
        if (wordsForPattern.length > 0) {
            const randomWord = this.lexicon.randomWordFromArray(wordsForPattern);
            const insertIndex = this.bestInsertIndex(randomWord, pattern);
            if (horizontal) {
                return this.addWord(i, insertIndex, randomWord, true);
            } else {
                return this.addWord(insertIndex, i, randomWord, false);
            }
        } else {
            return false;
        }
    }

    public generateCrossword(difficulty: string): string[][] {
        for (let i = 0; i < this.size; i++) {
            this.addRandomWord(i, true);
            this.addRandomWord(this.size - i - 1, false);
        }
        return this.grid;
    }

    public saveState(): boolean {
        this.previousGridState = Utilities.deepCopy(this.grid);
        this.previousGridCounter = Utilities.deepCopy(this.gridCounter);
        return true;
    }

    public rollback(): boolean {
        this.grid = Utilities.deepCopy(this.previousGridState);
        this.gridCounter = Utilities.deepCopy(this.previousGridCounter);
        return true;
    }
}
