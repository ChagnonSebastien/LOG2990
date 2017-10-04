import { Utilities } from './utilities';

export class Crossword {
    public _id: string;
    public difficulty: string;
    public size: number;
    public grid: String[][];
    public previousGridState: String[][];
    public gridCounter: number[][];
    public previousGridCounter: number[][];

    constructor(size: number) {
        this.size = size;
        this.grid = this.newGrid(size, ' ');
        this.gridCounter = this.newGrid(size, 0);
        this.saveState();
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
