import { Word } from '../../../../commun/word';
import { SquareStatus } from './square-status';

export class CrosswordGame {
    // public attributes

    public wordsWithIndex: Array<Word>;
    public wordMap: Map<string, Word>;

    // private attributes

    private size: number;
    private grid: string[][];
    private foundWords: Set<string>;
    private gridWords: Array<string>[][];
    private status: SquareStatus[][];

    constructor(grid: string[][], wordsWithIndex: Array<Word>, listOfWords: Array<string>) {
        this.size = grid.length;
        this.grid = grid;
        this.wordsWithIndex = wordsWithIndex;
        this.foundWords = new Set<string>();
        this.wordMap = this.initializeWordMap();
        this.gridWords = this.initializeGridWords();
        this.status = this.initializeSquareStatus();
    }

    // public methods

    public getStatus(): SquareStatus[][] {
        return this.status;
    }

    public insertLetter(charCode: number, i: number, j: number) {
        // if the letter is found or square is black, prevent any further action
        if (this.status[i][j].found || this.status[i][j].black) {
            return;
        }

        const inputLetter = String.fromCharCode(charCode).toLowerCase();
        const correctLetter = this.grid[i][j].toLowerCase();

        this.status[i][j].input = inputLetter;

        if (inputLetter === correctLetter) {
            this.checkIfWordsFound(i, j);
        }
    }

    public eraseLetter(i: number, j: number) {
        // if the letter is found, prevent any further action
        if (this.status[i][j].found) {
            return;
        }
        this.status[i][j].input = '';
    }

    public clearSelectedWord(word: string) {
        const wordInfo = this.wordMap.get(word);
        this.forEachLetter(wordInfo, this.unselectSquare.bind(this));
    }

    public setSelectedWord(word: string) {
        const wordInfo = this.wordMap.get(word);
        this.forEachLetter(wordInfo, this.selectSquare.bind(this));
    }

    // private methods

    private forEachLetter(word: Word, callback) {
        for (let k = 0; k < word.word.length; k++) {
            const i = word.horizontal ? word.i : word.i + k;
            const j = word.horizontal ? word.j + k : word.j;
            callback(i, j);
        }
    }

    // used by constructor

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

    // helper methods

    private checkIfWordsFound(i: number, j: number) {
        for (const word of this.gridWords[i][j]) {
            const wordInfo = this.wordMap.get(word);
            if (this.wordFound(wordInfo)) {
                this.markWordAsFound(wordInfo);
            }
        }
    }

    private wordFound(word: Word): boolean {
        for (let k = 0; k < word.word.length; k++) {
            const i = word.horizontal ? word.i : word.i + k;
            const j = word.horizontal ? word.j + k : word.j;
            if (this.status[i][j].input.toLowerCase() !== this.grid[i][j].toLowerCase()) {
                return false;
            }
        }
        return true;
    }

    private markWordAsFound(word: Word) {
        this.forEachLetter(word, this.markSquareAsFound.bind(this));
        this.foundWords.add(word.word);
    }

    private markSquareAsFound(i: number, j: number) {
        this.status[i][j].empty = false;
        this.status[i][j].found = true;
        this.unselectSquare(i, j);
    }

    private selectSquare(i: number, j: number) {
        this.status[i][j].selected = true;
    }

    private unselectSquare(i: number, j: number) {
        this.status[i][j].selected = false;
    }
}
