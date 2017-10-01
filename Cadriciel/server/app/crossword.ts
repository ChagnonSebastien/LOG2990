import { Utilities } from './utilities';
import { Lexicon } from './lexicon';
import * as path from 'path';

export class CrosswordGenerator {
    public size: number;
    public grid: String[][];
    public previousGridState: String[][];
    public gridCounter: number[][];
    public previousGridCounter: number[][];
    public lexicon: Lexicon;

    constructor(size: number) {
        this.size = size;
        this.grid = this.newGrid(size, ' ');
        this.gridCounter = this.newGrid(size, 0);
        this.saveState();
        let jsonPath = path.join(__dirname, '..', '..', '..', 'app', 'words.json');
        this.lexicon = new Lexicon(jsonPath);
    }

    public newGrid(size: number, fill: any): Array<any> {
        return new Array(size).fill(null).map(u => {
            const line = new Array(size).fill(null).map(u => {
                return fill;
            });
            return line;
        });
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
        this.saveState();
        for (const letter of word) {
            if (!this.addLetter(i, j, letter)) {
                this.rollback();
                return false;
            } else {
                i = horizontal ? i : i + 1;
                j = horizontal ? j + 1 : j;
            }
        }

        return true;
    }

    public addBlackSquares(i: number, j: number, word: string, horizontal: boolean): boolean {
        if (horizontal) {
            if (j > 0) {
                if (!this.addLetter(i, j - 1, '#')) {
                    return false;
                }
            } else if (j + word.length < this.size) {
                if (!this.addLetter(i, j + word.length, '#')) {
                    return false;
                }
            }
        } else {
            if (i > 0) {
                if (!this.addLetter(i - 1, j, '#')) {
                    return false;
                }
            } else if (i + word.length < this.size) {
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

        return true;
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
