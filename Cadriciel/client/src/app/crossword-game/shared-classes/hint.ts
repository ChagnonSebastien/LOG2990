export class Hint {
    public word: string;
    public definition: string;
    public found: boolean;
    public opponentFound: boolean;

    constructor(word: string, definition: string) {
        this.word = word;
        this.definition = definition;
        this.found = false;
    }
}
