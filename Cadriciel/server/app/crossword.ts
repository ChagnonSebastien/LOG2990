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

    public addLetter(i: number, j: number, letter: string): boolean {
        if (i >= this.size || j >= this.size) {
            return false;
        }

        this.grid[i][j] = letter;
        return true;
    }
}