import { assert, expect } from 'chai';
import  { Grid } from './grid';
import { Gene } from './gene';

describe('Grid', ()=>{
    const lexiconFilePath = '../server/lexicon/englishWords.txt';
    const gene: Array<Gene> = [];

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
        let grid = new Grid(10,lexiconFilePath, gene);
        grid.getLexicon(lexiconFilePath);
        assert(grid.lexicon[0] === 'aalii');
    })

    it('Should be able to initialize a lexicon in a map sorted by length', ()=>{
        let grid = new Grid(10,lexiconFilePath, gene);
        grid.initializeLexiconByLength();
        assert(grid.lexiconByLength[3][0].length === 3 && grid.lexiconByLength[10][0].length === 10);
    })

    it('Should be able to return the number of words in the lexicon', ()=>{
        let grid = new Grid(10,lexiconFilePath, gene);
        assert(grid.getSizeOfLexicon() === 46764);
    })

})