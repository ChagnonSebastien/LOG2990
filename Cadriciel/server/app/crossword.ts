export class Crossword {
    public size: number;
    public grid: String[][];

    constructor(size: number) {
        this.size = size;
        this.grid = this.getEmptyGrid(size);
    }

    public getEmptyGrid(size: number): String[][] {
        const line = Array(size).fill(' ');
        return Array(size).fill(line);
    }

    public indexOutOfBounds(i: number): boolean {
        return i < 0 || i >= this.size;
    }

    public indexesOutOfBounds(i: number, j: number): boolean {
        return this.indexOutOfBounds(i) || this.indexOutOfBounds(j);
    }

    public addLetter(i: number, j: number, letter: string): boolean {
        if (this.indexesOutOfBounds(i, j)) {
            return false;
        }
        this.grid[i][j] = letter;
        return true;
    }
}