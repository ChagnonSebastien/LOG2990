export class Crossword {
    public grid: String[];

    constructor(size: number) {
        this.grid = this.getEmptyGrid(size);
    }

    public getEmptyGrid(size: number): String[] {
        const line = Array(size).fill(' ');
        return Array(size).fill(line);
    }

    public addLetter(i: number, j: number, letter: string) {
    }
}