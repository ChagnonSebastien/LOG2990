export class SquareStatus {
    public black: boolean;
    public empty: boolean;
    public found: boolean;
    public input: string;
    public selected: boolean;
    public player1Selected: boolean;
    public player2Selected: boolean;

    constructor(character: string) {
        this.black = character === ' ' || character === '#';
        this.empty = !this.black;
        this.found = false;
        this.input = '';
        this.selected = false;
        this.player1Selected = false;
        this.player2Selected = false;
    }
}
