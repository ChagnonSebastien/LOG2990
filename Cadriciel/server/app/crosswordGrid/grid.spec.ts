import { assert } from 'chai';
import { Grid } from './grid';
import { Gene } from './gene';

describe('Grid', () => {
    const lexiconFilePath = '../server/lexicon/englishWords.txt';
    const gene: Array<Gene> = [];

    for (let i = 0; i < 20; i++) {
        if (i < 10) {
            const singleGene: Gene = { index: i % 10, horizontal: false };
            gene.push(singleGene);
        } else {
            const singleGene: Gene = { index: i % 10, horizontal: true };
            gene.push(singleGene);
        }
    }
    const testingGrid = new Grid(10, lexiconFilePath, gene);

    it('Should be able to reset the size', () => {
        const grid = new Grid(10, lexiconFilePath, gene);
        assert(grid.size === 10);
    });

    it('Should be able to reset the lexicon', () => {
        const grid = new Grid(10, lexiconFilePath, gene);
        assert(grid.lexicon.length !== 0);
    });

    it('Should be able to reset grid, gridLetterCounter and gridContribution', () => {
        const grid = new Grid(10, lexiconFilePath, gene);
        assert(grid.grid[0][0] === ' ' && grid.gridLetterCounter[0][0] === 0 && grid.gridContribution[0][0].length === 0);
    });

    it('Should be able to reset words in crossword', () => {
        const grid = new Grid(10, lexiconFilePath, gene);
        assert(grid.wordsInCrossword.length === 0);
    });

    it('Should be able to read and store the lexicon', () => {
        testingGrid.getLexicon(lexiconFilePath);
        assert(testingGrid.lexicon[0] === 'aalii');
    });

    it('Should be able to initialize a lexicon in a map sorted by length', () => {
        testingGrid.initializeLexiconByLength();
        assert(testingGrid.lexiconByLength[3][0].length === 3 && testingGrid.lexiconByLength[10][0].length === 10);
    });

    it('Should be able to return the number of words in the lexicon', () => {
        assert(testingGrid.getSizeOfLexicon() === 46764);
    });

    it('Should be able to return the words from the lexicon matching this pattern <  a  e>', () => {
        const wordsMatchingPattern = testingGrid.getWordsWith('  a  e');
        assert(wordsMatchingPattern[0][2] === 'a' && wordsMatchingPattern[0][5] === 'e');
    });

    it('Should return all the words containing the word <hell>. No restrictions on length.', () => {
        const wordsMatchingPattern: string = testingGrid.getBestWordForLine('hell');
        assert(wordsMatchingPattern.includes('hell'));
    });

    it('Should return no words mathcing this pattern <bbbbbbb>', () => {
        const wordsMatchingPattern: string = testingGrid.getBestWordForLine('bbbbbbb');
        assert(wordsMatchingPattern.length === 0);
    });

    it('Should return a random word from the lexicon', () => {
        const randomWord = testingGrid.getRandomWord();
        assert(randomWord !== '');
    });

    it('Should insert letter at specified position', () => {
        assert(testingGrid.insertLetter('a', 1, 1));
    });

    it('Should delete letter at specified position in the grid', () => {
        const deleted: boolean = testingGrid.deleteLetter('a', 1, 1);
        assert(deleted);
    });

    it('Should insert a word in the grid', () => {
        const inserted: boolean = testingGrid.insertWord('hello', 7, 1, true);
        assert(inserted && testingGrid.grid[7][1] === 'h');
    });

    it('Should delete a word in the grid', () => {
        const deleted: boolean = testingGrid.deleteWord('hello', 7, 1, true);
        assert(deleted);
    });

    it('Should insert random word in the grid', () => {
        const inserted: boolean = testingGrid.insertRandomWord();
        assert(inserted);
    });
});
