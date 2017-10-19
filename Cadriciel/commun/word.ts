export class Word {
    public word: string;
    public i: number;
    public j: number;
    public horizontal: boolean;

    constructor(i: number, j: number, word: string, horizontal: boolean) {
        this.i = i;
        this.j = j;
        this.word = word;
        this.horizontal = horizontal;
    }
}