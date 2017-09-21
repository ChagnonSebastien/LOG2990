import { Gene } from './gene';
import { LexiconReader } from '../lexicon-reader';

export class Grid {
    size: number;
    lexiconFile: string;
    lexicon: string[];
    grid: Array<string[]>;
    gridLetterCounter: Array<number[]>;
    gridContribution: Array<Array<number[]>>;
    words: Set<string>;
    wordsInCrossword: string[];
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
}