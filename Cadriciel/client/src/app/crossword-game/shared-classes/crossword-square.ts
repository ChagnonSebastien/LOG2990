export class CrosswordSquare {
    public black: boolean;
    public empty: boolean;
    public found: boolean;
    public answer: string;
    public input: string;
    public selected: boolean;
    public player1Selected: boolean;
    public player2Selected: boolean;
    public words: Array<string>;

    constructor(character: string) {
        this.black = character === ' ' || character === '#';
        this.empty = !this.black;
        this.found = false;
        this.answer = character;
        this.input = '';
        this.selected = false;
        this.player1Selected = false;
        this.player2Selected = false;
        this.words = new Array<string>();
    }

    public letterFound(): boolean {
        return this.answer.toLowerCase() === this.input.toLowerCase();
    }
}
