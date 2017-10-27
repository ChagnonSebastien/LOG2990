export class CrosswordSquare {
    public black: boolean;
    public empty: boolean;
    public found: boolean;
    private answer: string;
    public input: string;
    public selected: boolean;
    public player1Selected: boolean;
    public player2Selected: boolean;

    constructor(character: string) {
        this.black = character === ' ' || character === '#';
        this.empty = !this.black;
        this.found = false;
        this.answer = character;
        this.input = '';
        this.selected = false;
        this.player1Selected = false;
        this.player2Selected = false;
    }
}
