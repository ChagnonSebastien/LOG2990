import { Word } from '../word';

export class HintSelection {
    public previous: string;
    public current: Word;

    constructor(previous: string, current: Word) {
        this.previous = previous;
        this.current = current;
    }
}
