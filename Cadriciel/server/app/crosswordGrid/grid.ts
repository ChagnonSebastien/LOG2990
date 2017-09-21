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

    constructor(size: number, lexiconFilePath:string, genes: Array<Gene>) {
        this.lexiconReader = new LexiconReader();
        this.gridLetterCounter = [];
        this.gridContribution = [];
        this.grid = [];
        this.reset(size, lexiconFilePath, genes);
    }

    public reset(size: number, lexiconFilePath: string, genes: Array<Gene>) {
        this.size = size;
        this.lexiconFile = lexiconFilePath;
        this.getLexicon(lexiconFilePath);
        for(let i = 0; i < this.size; i++) {
            for(let j = 0; j < this.size; j++) {
                this.grid[i][j] = ' ';
                this.gridLetterCounter[i][j] = 0;
                this.gridContribution[i][j] = [];
            }
        }

        this.genes = [];

    }


    /*     def reset(self, size, lexicon, gene):
        self.size = size
        self.lexiconFile = lexicon
        self.getLexicon(lexicon)
        self.initializeLexiconByLength()
        self.grid = [ [' ' for j in range(self.size)] for i in range(self.size) ]
        self.gridLetterCounter = [[0 for j in range(self.size)] for i in range(self.size)]
        self.gridContribution = [[[] for j in range(self.size)] for i in range(self.size)]
        self.words = set()
        self.wordsInCrossword = []
        self.originalGene = gene
        self.constraintsToSatisfy = gene
        self.constraintsToSatisfy = deque(self.constraintsToSatisfy) */


        /*     def getLexicon(self, lexicon):
        with open(lexicon) as lexicon_file:
            self.lexicon = json.load(lexicon_file) */
        public getLexicon(lexiconFilePath:string){
            this.lexicon = this.lexiconReader.readWords(lexiconFilePath);
        }


        /*     def initializeLexiconByLength(self):
        self.lexiconByLength = {}
        for word in self.lexicon:
            if len(word) > self.size:
                continue
            if self.lexiconByLength.get(len(word)) is None:
                self.lexiconByLength[len(word)] = []
            self.lexiconByLength[len(word)].append(word) */
}