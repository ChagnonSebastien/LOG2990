export class Grid {

    /*     def __init__(self, size, lexicon, gene):
        self.reset(size, lexicon, gene)

    def reset(self, size, lexicon, gene):
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

    public size: number;
    public lexiconFile: string;
    public grid: Array<string[]>;
    public gridLetterCounter: Array<number[]>;
    public gridContribution: Array<number[]>;
    public words: Set<string>;
    public wordsInCrossword: string[];
    public gene:number;
    public contraintsToSatisfy: number;


    
}