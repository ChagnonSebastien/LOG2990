import { CrosswordGenerator } from '../crossword-generator';
import { Crossword } from '../../../commun/crossword/crossword';
import { Word } from '../../../commun/word';

export class CrosswordMutationManager {
    private nextMutations: Map<string, Crossword>;
    private foundWords: Map<string, Array<Word>>;
    private crosswordGenerator: CrosswordGenerator;

    constructor() {
        this.nextMutations = new Map<string, Crossword>();
        this.foundWords = new Map<string, Array<Word>>();
        this.crosswordGenerator = new CrosswordGenerator(10);
    }

    public newGame(gameId: string, level: string) {
        const crossword = this.newCrossword(level);
        this.foundWords.set(gameId, new Array<Word>());
        this.nextMutations.set(gameId, crossword);
    }

    public updateMutation(gameId: string, foundWord: Word): void {
        this.addToFoundWords(gameId, foundWord);

        const crossword = this.nextMutations.get(gameId);
        crossword.crossword = this.crosswordGenerator
            .mutate(crossword.difficulty, this.foundWords.get(gameId));
        crossword.wordsWithIndex = this.crosswordGenerator.wordsWithIndex;
        crossword.listOfWords = Array.from(this.crosswordGenerator.words);
    }

    public getNextMutation(gameId: string): Crossword {
        return this.nextMutations.get(gameId);
    }

    private newCrossword(level: string): Crossword {
        const crossword = new Crossword();
        crossword.crossword = this.crosswordGenerator.newCrossword(level);
        crossword.wordsWithIndex = this.crosswordGenerator.wordsWithIndex;
        crossword.listOfWords = Array.from(this.crosswordGenerator.words);
        crossword.difficulty = level;
        return crossword;
    }

    private addToFoundWords(gameId: string, foundWord: Word) {
        this.foundWords
            .get(gameId)
            .push(foundWord);
    }
}
