import { assert, expect } from 'chai';
import  { Grid } from './grid';
import { Gene } from './gene';

describe('Grid', ()=>{
    const lexiconFilePath = '../server/lexicon/englishWords.txt';
    const gene: Array<Gene> = [];
    const testingGrid = new Grid(10,lexiconFilePath, gene);

    it('Should be able to reset the size and genes', ()=>{
        let grid = new Grid(10,lexiconFilePath, gene);
        assert(grid.size === 10 && grid.genes.length === 0);
    })

    it('Should be able to reset the lexicon', ()=>{
        let grid = new Grid(10,lexiconFilePath, gene);
        assert(grid.lexicon.length !== 0);
    })

    it('Should be able to reset grid, gridLetterCounter and gridContribution', ()=>{
        let grid = new Grid(10,lexiconFilePath, gene);
        assert(grid.grid[0][0] === ' ' && grid.gridLetterCounter[0][0] === 0 && grid.gridContribution[0][0].length === 0);
    })

    it('Should be able to reset words in crossword, original gene and constraints to satisfy', ()=>{
        let grid = new Grid(10,lexiconFilePath, gene);
        assert(grid.wordsInCrossword.length === 0 && grid.originalGene === gene && grid.contraintsToSatisfy === gene)
    })

    it('Should be able to read and store the lexicon', ()=>{
        testingGrid.getLexicon(lexiconFilePath);
        assert(testingGrid.lexicon[0] === 'aalii');
    })

    it('Should be able to initialize a lexicon in a map sorted by length', ()=>{
        testingGrid.initializeLexiconByLength();
        assert(testingGrid.lexiconByLength[3][0].length === 3 && testingGrid.lexiconByLength[10][0].length === 10);
    })

    it('Should be able to return the number of words in the lexicon', ()=>{
        assert(testingGrid.getSizeOfLexicon() === 46764);
    })

    it('Should be able to return the words from the lexicon matching this pattern <  a  e>', ()=>{
        const wordsMatchingPattern = testingGrid.getWordsWith('  a  e');
        assert(wordsMatchingPattern[0][2] === 'a' && wordsMatchingPattern[0][5] === 'e');
    })

    it('Should return all the words containing the word <hell>. No restrictions on length.', ()=>{
        const wordsMatchingPattern = testingGrid.getBestWordForLine('hell');
        const testingWord: string =  wordsMatchingPattern[Math.floor((Math.random() * wordsMatchingPattern.length) - 1)];
        assert(testingWord.includes('hell'));
    })

    it('Should return no words mathcing this pattern <bbbbbbb>', ()=>{
        const wordsMatchingPattern = testingGrid.getBestWordForLine('bbbbbbb');
        const testingWord: string =  wordsMatchingPattern[Math.floor((Math.random() * wordsMatchingPattern.length) - 1)];
        assert(wordsMatchingPattern.length === 0);
    })

    it('Should return a random word from the lexicon', ()=>{
        const randomWord = testingGrid.getRandomWord();
        assert(randomWord !== '');
    })

    it('Should add contribution 9 to the grid', ()=>{
        testingGrid.addContribution(9, 1,3);
        assert(testingGrid.gridContribution[1][3][0] === 9);
    })

})