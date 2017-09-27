export class Crossword {
    public grid: String[];

    constructor(size: number) {
        this.grid = this.getEmptyGrid(size);
    }

    public getEmptyGrid(size: number) {
        const line = Array(size).fill(' ');
        return Array(size).fill(line);
    }
}