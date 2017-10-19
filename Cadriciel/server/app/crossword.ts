import { Utilities } from './utilities';
import { Lexicon } from './lexicon';
import { CrosswordChecker } from './crossword-checker';
import { Word } from '../../commun/word';

const lexiconPath = './app/words.json';

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
    public previousWords: Set<string>;
    public wordsWithIndex: Array<Word>;

    constructor(size: number) {
        this.size = size;
        this.reset();
        this.saveState();
        this.loadLexicon(lexiconPath);
    }

    public reset() {
        this.words = new Set<string>();
        this.wordsWithIndex = new Array<Word>();
        this.grid = this.newGrid(this.size, ' ');
        this.gridCounter = this.newGrid(this.size, 0);
    }

    public setGrid(words: Array<Word>) {
        words.map((word) => {
            return this.addWord(word.i, word.j, word.word, word.horizontal);
        });
    }

    public newGrid(size: number, fill: any): Array<any> {
        return new Array(size).fill(null).map(res => {
            return new Array(size).fill(null).map(u => {
                return fill;
            });
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
        const wordToAdd: Word = new Word(i, j, word, horizontal);
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
        if (CrosswordChecker.verify(this) === false) {
            this.rollback();
            return false;
        }
        this.wordsWithIndex.push(wordToAdd);
        return true;
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
        this.wordsWithIndex = this.wordsWithIndex.filter((value) => {
            return value.word !== word;
        });
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

    public addRandomWord(i: number, horizontal: boolean, difficulty: string): boolean {
        const pattern = this.patternForLine(i, horizontal);

        let wordsForPattern: string[];
        switch (difficulty) {
            case ('easy'):
                wordsForPattern = this.lexicon.wordsForPattern(pattern, true);
                break;
            case ('normal'):
                wordsForPattern = this.lexicon.allWordsForPattern(pattern);
                break;
            case ('hard'):
                wordsForPattern = this.lexicon.wordsForPattern(pattern, false);
        }

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

    private generateCrossword(difficulty: string): string[][] {
        let foundWord = true;
        while (foundWord) {
            foundWord = false;
            for (let i = 0; i < this.size; i++) {
                foundWord = foundWord
                    || this.addRandomWord(i, true, difficulty)
                    || this.addRandomWord(this.size - i - 1, false, difficulty);
            }
        }

        return this.grid;
    }

    public newCrossword(difficulty: string): string[][] {
        this.reset();
        return this.generateCrossword(difficulty);
    }

    public mutate(difficulty: string, words: Array<Word>): string[][] {
        this.reset();
        this.setGrid(words);
        return this.generateCrossword(difficulty);
    }

    public saveState(): boolean {
        this.previousGridState = Utilities.deepCopy(this.grid);
        this.previousGridCounter = Utilities.deepCopy(this.gridCounter);
        this.previousWords = new Set(Array.from(this.words));
        return true;
    }

    public rollback(): boolean {
        this.grid = Utilities.deepCopy(this.previousGridState);
        this.gridCounter = Utilities.deepCopy(this.previousGridCounter);
        this.words = new Set(Array.from(this.previousWords));
        return true;
    }

    public printGrid() {
        console.log('-'.repeat(4 * this.size + 1));
        this.grid.forEach((line) => {
            process.stdout.write('|');
            line.forEach((letter) => {
                process.stdout.write(' ' + letter + ' |');
            });
            process.stdout.write('\n');
            console.log('-'.repeat(4 * this.size + 1));
        });
    }
}
