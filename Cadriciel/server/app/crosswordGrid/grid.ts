import { Gene } from './gene';
import { LexiconReader } from '../lexicon-reader';

interface WordInCrossword {
    word: string;
    i: number;
    j: number;
    horizontal: boolean;
}

export class Grid {
    public size: number;
    public lexiconFile: string;
    public lexicon: string[];
    public grid: Array<string[]>;
    public gridLetterCounter: Array<number[]>;
    public gridContribution: Array<Array<number[]>>;
    public words: Set<string>;
    public wordsInCrossword: Array<WordInCrossword>;
    public genes: Array<Gene>;
    public contraintsToSatisfy: Array<Gene>;
    public lexiconReader: LexiconReader;
    public originalGene: Array<Gene>;
    public lexiconByLength: Map<number, Array<string>>;



    constructor(size: number, lexiconFilePath: string, genes: Array<Gene>) {
        this.lexiconReader = new LexiconReader();
        this.gridLetterCounter = [];
        this.gridContribution = [];
        this.grid = [];
        this.genes = [];
        this.words = new Set<string>();
        this.wordsInCrossword = [];
        this.lexiconByLength = new Map<number, Array<string>>();
        this.reset(size, lexiconFilePath, genes);
    }

    public reset(size: number, lexiconFilePath: string, gene: Array<Gene>) {
        this.size = size;
        this.lexiconFile = lexiconFilePath;
        this.getLexicon(lexiconFilePath);
        for (let i = 0; i < this.size; i++) {
            this.grid[i] = [];
            this.gridLetterCounter[i] = [];
            this.gridContribution[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.grid[i][j] = ' ';
                this.gridLetterCounter[i][j] = 0;
                this.gridContribution[i][j] = [];
            }
        }
        this.words = new Set<string>();
        this.wordsInCrossword = [];
        this.contraintsToSatisfy = gene;
        this.originalGene = gene;
    }

    public getLexicon(lexiconFilePath: string) {
        this.lexicon = this.lexiconReader.readWords(lexiconFilePath);
    }

    public initializeLexiconByLength() {
        this.lexiconByLength = new Map<number, Array<string>>();

        for (let i = 3; i <= 10; i++) {
            this.lexiconByLength[i] = [];
            this.lexiconByLength[i] = this.lexiconReader.readWordsOfLength(this.lexicon, i);
        }
    }

    public getSizeOfLexicon(): number {
        return this.lexicon.length;
    }

    public printLexiconInConsole() {
        console.log(this.lexicon);
    }

    public getWordsWith(pattern: string): string[] {
        return this.lexiconReader.getWordsMatchingPattern(this.lexicon, pattern);
    }

    public getBestWordForLine(pattern: string): string {
        const wordsWithPattern: string[] = [];

        for (let i = 0; i < this.lexicon.length; i++) {
            if (this.lexicon[i].includes(pattern)) {
                wordsWithPattern.push(this.lexicon[i]);
            }
        }

        if (wordsWithPattern.length > 0) {
            const randomIndex = Math.floor(Math.random() * wordsWithPattern.length);
            return wordsWithPattern[randomIndex];
        }
        return '';
    }

    public getRandomWord(): string {
        return this.lexicon[Math.floor((Math.random() * this.lexicon.length))];
    }

    public insertLetter(letter: string, i: number, j: number): boolean {
        if (this.gridLetterCounter[i][j] > 0 && this.grid[i][j] !== letter) {
            return false;
        }
        this.grid[i][j] = letter;
        this.gridLetterCounter[i][j]++;
        return true;
    }

    public deleteLetter(letter: string, i: number, j: number): boolean {
        if (this.grid[i][j] !== letter) {
            return false;
        }
        if (this.gridLetterCounter[i][j] > 1) {
            this.gridLetterCounter[i][j]--;
        } else {
            this.gridLetterCounter[i][j] = 0;
            this.grid[i][j] = ' ';
        }

        return true;
    }

    public insertWord(word: string, i: number, j: number, horizontal: boolean): boolean {

        if (this.words.has(word)) {
            return false;
        }

        if ((horizontal && this.size < (j + word.length)) || (!horizontal && this.size < (i + word.length))) {
            return false;
        }

        const tempGrid = this.grid;
        const tempCounter = this.gridLetterCounter;
        const originalI = i;
        const originalJ = j;

        for (const letter of word) {
            if (!this.insertLetter(letter, i, j)) {
                this.grid = tempGrid;
                this.gridLetterCounter = tempCounter;
                return false;
            }
            if (horizontal) {
                j++;
            } else {
                i++;
            }
        }
        this.words.add(word);
        this.wordsInCrossword.push({ word: word, i: originalI, j: originalJ, horizontal: horizontal });
        return true;

    }

    public deleteWord(word: string, i: number, j: number, horizontal: boolean): boolean {
        if (!this.words.has(word)) {
            return false;
        }

        if ((horizontal && this.size < (j + word.length)) || (!horizontal && this.size < (i + word.length))) {
            return false;
        }

        const tempGrid = this.grid;
        const tempCounter = this.gridLetterCounter;

        for (const letter of word) {
            if (!this.deleteLetter(letter, i, j)) {
                this.grid = tempGrid;
                this.gridLetterCounter = tempCounter;
                return false;
            }
            if (horizontal) {
                j++;
            } else {
                i++;
            }
        }
        this.words.delete(word);
        let wordIndex: number;
        const wordToDelete: WordInCrossword = { word: word, i: i, j: j, horizontal: horizontal };
        for (let x = 0; x < this.wordsInCrossword.length; x++) {
            if (this.wordsInCrossword[x][word] === wordToDelete[word]) {
                wordIndex = x;
            }

        }

        delete (this.wordsInCrossword[wordIndex]);
        return true;
    }

    public shuffle(array: Array<any>): Array<any> {
        let j = 0, temp = null;

        for (let y: number = array.length; y > 0; y--) {
            j = Math.floor(Math.random() * (y + 1));
            temp = array[y];
            array[y] = array[j];
            array[j] = temp;
        }

        return array;
    }

    public insertRandomWord(): boolean {
        let where: Gene = new Gene();
        let pattern = '';
        if (this.contraintsToSatisfy.length > 0) {
            this.contraintsToSatisfy.reverse();
            where = this.contraintsToSatisfy.pop();
            this.contraintsToSatisfy.reverse();
        }

        if (where.horizontal === true) {
            for (let i = 0; i < this.grid[where.index].length; i++) {
                pattern.concat(this.grid[where.index][i]);
            }
        } else {
            for (let i = 0; i < this.size; i++) {
                pattern.concat(this.grid[i][where.index]);
            }
        }

        const wordToInsert = this.getBestWordForLine(pattern);
        if (wordToInsert.length === 0) {
            return false;
        }

        let randomIndexes: number[] = [];
        for (let i = 0; i < (this.size - wordToInsert.length); i++) {
            randomIndexes[i] = i;
        }

        let bestIndex = 0;
        let bestScore = 0;

        if (pattern === '          ') {
            randomIndexes = this.shuffle(randomIndexes);
        }

        for (const index of randomIndexes) {
            let indexScore = 0;
            for (let j = 0; j < wordToInsert.length; j++) {
                if (wordToInsert[j] === pattern[index + j]) {
                    indexScore++;
                }
            }
            if (indexScore >= bestScore) {
                bestIndex = index;
                bestScore = indexScore;
            }
        }
        if (where.horizontal === true) {
            this.insertWord(wordToInsert, where.index, bestIndex, true);
        } else {
            this.insertWord(wordToInsert, bestIndex, where.index, false);
        }

        return true;

    }

    public generate() {
        while (this.contraintsToSatisfy.length > 0) {
            if (!this.insertRandomWord()) {
                this.reset(this.size, this.lexiconFile, this.originalGene);
            }
        }
    }
}
