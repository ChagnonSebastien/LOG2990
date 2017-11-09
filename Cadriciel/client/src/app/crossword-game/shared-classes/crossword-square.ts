import { Word } from '../../../../../commun/word';

export class CrosswordSquare {
    public black: boolean;
    public empty: boolean;
    public found: boolean;
    public opponentFound: boolean;
    public answer: string;
    public input: string;
    public selected: boolean;
    public opponentSelected: boolean;
    public words: Array<Word>;

    constructor(character: string) {
        if (character.length > 1) {
            character = character.charAt(0);
        }
        this.black = character === ' ' || character === '#';
        this.empty = !this.black;
        this.found = false;
        this.opponentFound = false;
        this.answer = character;
        this.input = '';
        this.selected = false;
        this.opponentSelected = false;
        this.words = new Array<Word>();
    }

    public letterFound(): boolean {
        if (this.black || !this.empty) {
            return false;
        }
        return this.answer.toLowerCase() === this.input.toLowerCase();
    }
}
