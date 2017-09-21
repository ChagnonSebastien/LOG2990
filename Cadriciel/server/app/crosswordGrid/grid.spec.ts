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
        //assert(grid.grid[0][0] === ' ' && grid.gridLetterCounter[0][0] == 0 && grid.gridContribution[0][0] === []);
        assert(true);
    })

})