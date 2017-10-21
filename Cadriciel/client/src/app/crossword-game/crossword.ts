import { Word } from '../../../../commun/word';

export class Crossword {
    private size: number;
    public grid: string[][];
    public wordsWithIndex: Array<Word>;
    public foundWords: Array<Word>;
    public wordMap: Map<string, Word>;
    public wordLetterCounter: Map<string, number>;
    public gridWords: Array<string>[][];

    constructor(grid: string[][], wordsWithIndex: Array<Word>, listOfWords: Array<string>) {
        this.size = grid.length;
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
        this.gridWords = this.initializeGridWords();
    }

    private initializeGridWords(): Array<string>[][] {
        return this.wordsWithIndex.reduce((gridWords, word) => {
            return this.insertWordIntoGridWords(gridWords, word);
        }, this.blankGridWords());
    }

    private blankGridWords(): Array<string>[][] {
        return new Array(this.size).fill(undefined).map(res => {
            return new Array(this.size).fill(undefined).map(u => {
                return new Array<string>();
            });
        });
    }

    private insertWordIntoGridWords(gridWords: Array<string>[][], word: Word): Array<string>[][] {
        for (let k = 0; k < word.word.length; k++) {
            if (word.horizontal) {
                gridWords[word.i][word.j + k].push(word.word);
            } else {
                gridWords[word.i + k][word.j].push(word.word);
            }
        }
        return gridWords;
    }
}
