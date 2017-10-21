import { Word } from '../../../../commun/word';

export class Crossword {
    public grid: string[][];
    public wordsWithIndex: Array<Word>;
    public foundWords: Array<Word>;
    public wordMap: Map<string, Word>;
    public wordLetterCounter: Map<string, number>;
    public gridWords: Array<string>[][];

    constructor(grid: string[][], wordsWithIndex: Array<Word>, listOfWords: Array<string>) {
        this.grid = grid;
        this.wordsWithIndex = wordsWithIndex;
        this.foundWords = new Array<Word>();
        this.wordMap = wordsWithIndex.reduce((map, obj) => {
            map[obj.word] = obj;
            return map;
        }, new Map<string, Word>());
        this.wordLetterCounter = listOfWords.reduce((map, obj) => {
            map[obj] = obj.length;
            return map;
        }, new Map<string, number>());
    }
}
