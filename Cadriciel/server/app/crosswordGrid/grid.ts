import { Gene } from './gene';
import { LexiconReader } from '../lexicon-reader';

type wordInCrossword = {
    word: string,
    i: number,
    j: number,
    horizontal: boolean
};

export class Grid {
    size: number;
    lexiconFile: string;
    lexicon: string[];
    grid: Array<string[]>;
    gridLetterCounter: Array<number[]>;
    gridContribution: Array<Array<number[]>>;
    words: Set<string>;
    wordsInCrossword: Array<wordInCrossword>;
    genes: Array<Gene>;
    contraintsToSatisfy: Array<Gene>;
    lexiconReader: LexiconReader;
    originalGene: Array<Gene>;
    lexiconByLength: Map<number, Array<string>>;

    constructor(size: number, lexiconFilePath:string, genes: Array<Gene>) {
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
        for(let i = 0; i < this.size; i++) {
                this.grid[i] = [];
                this.gridLetterCounter[i] = [];
                this.gridContribution[i] = [];
            for(let j = 0; j < this.size; j++) {
                this.grid[i][j] = ' ';
                this.gridLetterCounter[i][j] = 0;
                this.gridContribution[i][j] = [];
            }
        }

        this.wordsInCrossword = [];
        this.originalGene = gene;
        this.contraintsToSatisfy = gene;
    }

        public getLexicon(lexiconFilePath:string){
            this.lexicon = this.lexiconReader.readWords(lexiconFilePath);
        }

        public initializeLexiconByLength() {
            this.lexiconByLength = new Map<number,Array<string>>();

            for(let i = 3; i <= 10; i++) {
                this.lexiconByLength[i] = [];
                this.lexiconByLength[i] = this.lexiconReader.readWordsOfLength(this.lexicon, i);
            }
        }

        public getSizeOfLexicon(): number {
            return this.lexicon.length;
        }

        public printLexiconInConsole(){
            console.log(this.lexicon);
        }

        public getWordsWith(pattern:string): string[]{
            return this.lexiconReader.getWordsMatchingPattern(this.lexicon, pattern);
        }

        public getBestWordForLine(pattern:string): string[] {
            let wordsWithPattern: string[] = [];

            for(let i = 0; i <  this.lexicon.length; i++){
                if(this.lexicon[i].includes(pattern)){
                    wordsWithPattern.push(this.lexicon[i]);
                }
            }
            return wordsWithPattern;
        }

    public getRandomWord(): string {
        return this.lexicon[Math.floor((Math.random() * this.lexicon.length) - 1)];
    }

    /*def insertLetter(self, letter, i, j):
        if self.gridLetterCounter[i][j] > 0 and self.grid[i][j] != letter:
            return False
        self.grid[i][j] = letter
        self.gridLetterCounter[i][j] += 1
        return True*/
    
    public insertLetter(letter:string, i:number, j:number): boolean{
        if(this.gridLetterCounter[i][j] > 0 && this.grid[i][j] !== letter){
            return false;
        }
        this.grid[i][j] = letter;
        this.gridLetterCounter[i][j]++;
        return true;
    }

    public deleteLetter(letter:string, i: number, j:number):boolean{
        if(this.grid[i][j] != letter){
            return false;
        }
        if(this.gridLetterCounter[i][j] > 1){
            this.gridLetterCounter[i][j]--;
        }
        else {
            this.gridLetterCounter[i][j] = 0;
            this.grid[i][j]= ' '
        }

        return true;
    }

    public insertWord(word:string, i:number, j:number, horizontal:boolean): boolean{
        
        if(this.words.has(word)){
            return false;
        }

        if((horizontal && this.size < (j + word.length)) || (!horizontal && this.size < (i + word.length))) {
            return false;
        }

        let tempGrid = this.grid;
        let tempCounter = this.gridLetterCounter;
        let originalI = i;
        let originalJ = j;

        for(let letter of word){
            if(!this.insertLetter(letter, i, j)){
                this.grid = tempGrid;
                this.gridLetterCounter = tempCounter;
                return false;
            }
            if(horizontal) {
                j++;
            }
            else {
                i++;
            }
        }
        this.words.add(word);
        this.wordsInCrossword.push({word: word, i: originalI, j: originalJ, horizontal: horizontal});
        return true;

    }

    public deleteWord(word:string, i:number, j:number, horizontal:boolean): boolean {
        if(!this.words.has(word)){
            return false;
        }

        if((horizontal && this.size < (j + word.length)) || (!horizontal && this.size < (i + word.length))) {
            return false;
        }

        let tempGrid = this.grid;
        let tempCounter = this.gridLetterCounter;
        let originalI = i;
        let originalJ = j;

        let contribution: wordInCrossword = {word: word, i: i, j: j, horizontal: horizontal};

        for(let letter of word){
            if(!this.deleteLetter(letter, i, j)){
                this.grid = tempGrid;
                this.gridLetterCounter = tempCounter;
                return false;
            }
            if(horizontal){
                j++;
            }
            else {
                i++;
            }
        }

        this.words.delete(word);
        let wordIndex:number;
        let wordToDelete: wordInCrossword = {word: word, i: i, j: j, horizontal: horizontal};
        for(let i = 0; i < this.wordsInCrossword.length; i++){
            if(this.wordsInCrossword[i] === wordToDelete) {
                wordIndex = i;
            }
        
        }

        this.wordsInCrossword[wordIndex] = null;
        return true;
        
    }

}