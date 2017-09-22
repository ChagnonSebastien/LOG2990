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


        for(let i = 0; i <  this.size * 2; i++){
            if(i < this.size){
                let singleGene: Gene = {index: i % this.size, horizontal: true};
                this.genes.push(singleGene);
            }
        }
        this.contraintsToSatisfy = this.genes;
        this.originalGene = this.genes;
    }

        /* constraintsGene = [(i % defaultGridSize, True if i < defaultGridSize else False) for i in range(defaultGridSize * 2)]
for i in range(defaultGridSize * 2):
    if i < defaultGridSize:
        constraintsGene.append(i % defaultGridSize, True)
    else:
        constraintsGene.append(i % defaultGridSize, False) */

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

        public getBestWordForLine(pattern:string): string {
            let wordsWithPattern: string[] = [];

            for(let i = 0; i <  this.lexicon.length; i++){
                if(this.lexicon[i].includes(pattern)){
                    wordsWithPattern.push(this.lexicon[i]);
                }
            }

            if(wordsWithPattern.length > 0){
                let randomIndex = Math.floor(Math.random() * (wordsWithPattern.length - 1));
                return wordsWithPattern[randomIndex];
            }
            return '';
        }

    public getRandomWord(): string {
        return this.lexicon[Math.floor((Math.random() * this.lexicon.length) - 1)];
    }
    
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
            if(this.wordsInCrossword[i][word] === wordToDelete[word]) {
                wordIndex = i;
            }
        
        }

        delete(this.wordsInCrossword[wordIndex]);
        return true;
    }

    public shuffle(array: Array<any>): Array<any>{
        let i = 0, j = 0, temp = null;

        for(let i = array.length - 1; i > 0; i--){
            j = Math.floor(Math.random() * (i + 1));
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        return array;
    }

    public insertRandomWord(): boolean {
        let where: Gene;
        let pattern: string = '';
        if(this.contraintsToSatisfy.length > 0){
            this.contraintsToSatisfy.reverse();
            where = this.contraintsToSatisfy.pop();
            this.contraintsToSatisfy.reverse();
        }

        if(where[1] === true){
            pattern = JSON.stringify(this.grid[where[0]]);
        }

        else {
            for(let i = 0; i < this.size; i ++){
                pattern.concat(this.grid[i][where[0]]);
            }
        }
        let wordToInsert = this.getBestWordForLine(pattern);
        if(wordToInsert.length === 0){
            return false;
        }
        
        let randomIndexes: number[] = [];
        for(let i = 0; i < (this.size - wordToInsert.length); i++){
            randomIndexes[i] = i;
        }

        let bestIndex = 0;
        let bestScore = 0;

        if(pattern === '          '){
            randomIndexes = this.shuffle(randomIndexes);
        }

        for(let index of randomIndexes){
            let indexScore = 0;
            for(let j = 0; j < wordToInsert.length; j++){
                if(wordToInsert[j] == pattern[index + j]){
                    indexScore++;
                }
            }
            if(indexScore >= bestScore){
                bestIndex = index;
                bestScore = indexScore;
            }
        }
        if(where.horizontal === true){
            this.insertWord(wordToInsert, where.index, bestIndex, true);
        }
        else {
            this.insertWord(wordToInsert, bestIndex, where.index, false);
        }

        return true;

    }

    public generate() {
        let bestScore = 0;
        let totalScore = 0;
        let bestGrid = this.grid;
        let bestGridLetterCounter = this.gridLetterCounter;
        let bestWordsInCrossword = this.wordsInCrossword;
        let bestWords = this.words;

        while(this.contraintsToSatisfy.length > 0){
                if(!this.insertRandomWord()){
                    this.reset(this.size, this.lexiconFile, this.originalGene);
                }
            }
    }

/* def generate(self):
        start = timeit.default_timer()
        bestScore = 0
        totalScore = 0
        bestGrid = copy.deepcopy(self.grid)
        bestGridLetterCounter = copy.deepcopy(self.gridLetterCounter)
        bestGridContribution = copy.deepcopy(self.gridContribution)
        bestWordsInCrossword = copy.deepcopy(self.wordsInCrossword)
        bestWords = copy.deepcopy(self.words)
        for i in range(3):
            while len(self.constraintsToSatisfy) > 0:
                if not self.insertRandomWord():
                    self.reset(self.size, self.lexiconFile, self.originalGene)
            gridScore = self.scoreGrid()
            totalScore += gridScore
            #self.printGrid()
            #print "Score of grid: ", gridScore
            if gridScore > bestScore:
                bestScore = gridScore
                bestGrid = copy.deepcopy(self.grid)
                bestGridLetterCounter = copy.deepcopy(self.gridLetterCounter)
                bestGridContribution = copy.deepcopy(self.gridContribution)
                bestWordsInCrossword = copy.deepcopy(self.wordsInCrossword)
                bestWords = copy.deepcopy(self.words)
            self.reset(self.size, self.lexiconFile, self.originalGene)
        self.grid = bestGrid
        self.gridLetterCounter = bestGridLetterCounter
        self.gridContribution = bestGridContribution
        self.wordsInCrossword = bestWordsInCrossword
        self.words = bestWords
        self.printGrid()
        stop = timeit.default_timer()
        pprint.pprint(self.wordsInCrossword)
        #pprint.pprint(self.gridContribution)
        #pprint.pprint(self.gridLetterCounter)
        print "BEST SCORE :", bestScore        
        #print "Total time:", stop - start
        return totalScore */
}