import { Word } from '../../../../commun/word';
import { SquareStatus } from './square-status';

export class CrosswordGame {
    private size: number;
    private grid: string[][];
    public wordsWithIndex: Array<Word>;
    private foundWords: Array<Word>;
    private wordMap: Map<string, Word>;
    private gridWords: Array<string>[][];
    public status: SquareStatus[][];

    constructor(grid: string[][], wordsWithIndex: Array<Word>, listOfWords: Array<string>) {
        this.size = grid.length;
        this.grid = grid;
        this.wordsWithIndex = wordsWithIndex;
        this.foundWords = new Array<Word>();
        this.wordMap = this.initializeWordMap();
        this.gridWords = this.initializeGridWords();
        this.status = this.initializeSquareStatus();
    }

    public insertLetter(charCode: number, i: number, j: number) {
        if (this.status[i][j].found) {
            return; // if the letter is found, prevent any further action
        }
        const inputLetter = String.fromCharCode(charCode).toLowerCase();
        const correctLetter = this.grid[i][j].toLowerCase();
        this.status[i][j].input = inputLetter;
        if (inputLetter === correctLetter) {
            this.checkIfWordsFound(i, j);
        }
    }

    public checkIfWordsFound(i: number, j: number) {
        this.gridWords[i][j].map((word) => {
            const wordInfo = this.wordMap.get(word);
            if (this.wordFound(wordInfo)) {
                this.markWordAsFound(wordInfo);
            }
        });
    }

    private wordFound(word: Word): boolean {
        return Array(word.word.length).fill(undefined).map((val, k) => {
            const i = word.horizontal ? word.i : word.i + k;
            const j = word.horizontal ? word.j + k : word.j;
            return this.status[i][j].input.toLowerCase() === this.grid[i][j].toLowerCase();
        }).reduce((prev, cur) => {
            return prev && cur;
        });
    }

    public eraseLetter(i: number, j: number) {
        if (this.status[i][j].found) {
            return; // if the letter is found, prevent any further action
        }
        this.status[i][j].input = '';
    }

    public clearSelectedWord(word: string) {
        const wordInfo = this.wordMap.get(word);
        for (let k = 0; k < word.length; k++) {
            const i = wordInfo.horizontal ? wordInfo.i : wordInfo.i + k;
            const j = wordInfo.horizontal ? wordInfo.j + k : wordInfo.j;
            this.unselectSquare(i, j);
        }
    }

    public setSelectedWord(word: string) {
        const wordInfo = this.wordMap.get(word);
        for (let k = 0; k < word.length; k++) {
            const i = wordInfo.horizontal ? wordInfo.i : wordInfo.i + k;
            const j = wordInfo.horizontal ? wordInfo.j + k : wordInfo.j;
            this.selectSquare(i, j);
        }
    }

    // Provide O(1) access to information on a word.
    private initializeWordMap(): Map<string, Word> {
        return this.wordsWithIndex.reduce((map, obj) => {
            map.set(obj.word, obj);
            return map;
        }, new Map<string, Word>());
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
            const i = word.horizontal ? word.i : word.i + k;
            const j = word.horizontal ? word.j + k : word.j;
            gridWords[i][j].push(word.word);
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

    private markWordAsFound(word: Word) {
        for (let k = 0; k < word.word.length; k++) {
            const i = word.horizontal ? word.i : word.i + k;
            const j = word.horizontal ? word.j + k : word.j;
            this.markSquareAsFound(i, j);
        }
    }

    private markSquareAsFound(i: number, j: number) {
        this.status[i][j].empty = false;
        this.status[i][j].found = true;
    }

    private selectSquare(i: number, j: number) {
        this.status[i][j].selected = true;
    }

    private unselectSquare(i: number, j: number) {
        this.status[i][j].selected = false;
    }
}
