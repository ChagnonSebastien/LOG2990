import { Gene } from './gene';

export class Grid {
    size: number;
    lexiconFile: string;
    grid: Array<string[]>;
    gridLetterCounter: Array<number[]>;
    words: Set<string>;
    wordsInCrossword: string[];
    genes: Array<Gene>;
    contraintsToSatisfy: Array<Gene>;

    constructor(size: number, lexiconFile: string, genes: Array<Gene>) {

    }

    public reset(size: number, lexiconFile: string, genes: Array<Gene>) {
        this.size = size;
        this.grid = Array<string[]>();
    }
}