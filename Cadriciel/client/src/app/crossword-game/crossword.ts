import { Word } from '../../../../commun/word';
import { SquareStatus } from './square-status';

export class Crossword {
    private size: number;
    public grid: string[][];
    public wordsWithIndex: Array<Word>;
    public foundWords: Array<Word>;
    public wordMap: Map<string, Word>;
    public wordLetterCounter: Map<string, number>;
    public gridWords: Array<string>[][];
    public status: SquareStatus[][];

    constructor(grid: string[][], wordsWithIndex: Array<Word>, listOfWords: Array<string>) {
        this.size = grid.length;
        this.grid = grid;
        this.wordsWithIndex = wordsWithIndex;
        this.foundWords = new Array<Word>();
        this.wordMap = this.initializeWordMap();
        this.wordLetterCounter = this.initializeWordLetterCounter(listOfWords);
        this.gridWords = this.initializeGridWords();
        this.status = this.initializeSquareStatus();
    }

    public checkIfCorrectLetter(charCode: number, i: number, j: number) {
        const inputLetter = String.fromCharCode(charCode).toLowerCase();
        const correctLetter = this.grid[i][j].toLowerCase();
        if (!this.status[i][j].letterFound && inputLetter === correctLetter) {
            this.gridWords[i][j].map((word) => {
                this.wordLetterCounter[word]--;
            });
        }
    }

    public checkIfWordFound(i: number, j: number) {
        this.gridWords[i][j].map((word) => {
            if (this.wordLetterCounter[word] === 0) {
                this.foundWord(true, word);
            }
        });
    }

    public eraseLetter(i: number, j: number) {
        if (this.status[i][j].letterFound) {
            this.status[i][j].letterFound = false;
            this.gridWords[i][j].map((word) => {
                this.wordLetterCounter[word]++;
            });
        }
    }

    // Provide O(1) access to information on a word.
    private initializeWordMap(): Map<string, Word> {
        return this.wordsWithIndex.reduce((map, obj) => {
            map[obj.word] = obj;
            return map;
        }, new Map<string, Word>());
    }

    // Provide letter counters for each word. When the counter reaches 0, the word is found.
    private initializeWordLetterCounter(listOfWords: Array<string>): Map<string, number> {
        return listOfWords.reduce((map, obj) => {
            map[obj] = obj.length;
            return map;
        }, new Map<string, number>());
    }

    // For each square, a list of words that contributed a letter to that square.
    private initializeGridWords(): Array<string>[][] {
        return this.wordsWithIndex.reduce((gridWords, word) => {
            return this.insertWordIntoGridWords(gridWords, word);
        }, this.blankGridWords());
    }

    // initializeGridWords() helper function.
    private blankGridWords(): Array<string>[][] {
        return new Array(this.size).fill(undefined).map(res => {
            return new Array(this.size).fill(undefined).map(u => {
                return new Array<string>();
            });
        });
    }

    // initializeGridWords() helper: inserts the word at each square it contributes to.
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

    // Status of the word
    private initializeSquareStatus(): SquareStatus[][] {
        return this.grid.map((row) => {
            return row.map((square) => {
                return new SquareStatus(square);
            });
        });
    }

    private foundWord(found: boolean, word: string) {
        const wordInfo = this.wordMap[word];
        for (let k = 0; k < word.length; k++) {
            if (wordInfo.horizontal) {
                this.squareFound(true, wordInfo.i, wordInfo.j + k);
            } else {
                this.squareFound(true, wordInfo.i + k, wordInfo.j);
            }
        }
    }

    private squareFound(found: boolean, i: number, j: number) {
        this.status[i][j].empty = !found;
        this.status[i][j].found = found;
    }
}
