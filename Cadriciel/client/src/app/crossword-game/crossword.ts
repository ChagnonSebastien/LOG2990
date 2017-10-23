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

    public async checkIfCorrectLetter(charCode: number, i: number, j: number) {
        const inputLetter = String.fromCharCode(charCode).toLowerCase();
        if (!this.status[i][j].found) {
            this.status[i][j].input = inputLetter;
        }
        const correctLetter = this.grid[i][j].toLowerCase();
        if (inputLetter === correctLetter) {
            const alreadyFound = this.status[i][j].letterFound;
            this.status[i][j].letterFound = true;
            if (!alreadyFound) {
                this.updateSquareStatus(i, j);
            }
        } else {
            this.status[i][j].letterFound = false;
        }
    }

    public async updateSquareStatus(i: number, j: number) {
        this.gridWords[i][j].map((word) => {
            if (this.checkIfWordFound(i, j, word)) {
                this.foundWord(true, word);
            }
        });
    }

    private checkIfWordFound(i: number, j: number, word: string): boolean {
        const wordInfo: Word = this.wordMap[word];
        let found = true;
        for (let k = 0; k < word.length; k++) {
            if (wordInfo.horizontal) {
                found = found && this.status[wordInfo.i][wordInfo.j + k].letterFound;
            } else {
                found = found && this.status[wordInfo.i + k][wordInfo.j].letterFound;
            }
        }
        console.log('FOUND: ', found);
        return found;
    }

    public eraseLetter(i: number, j: number) {
        if (this.status[i][j].letterFound) {
            this.status[i][j].letterFound = false;
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
