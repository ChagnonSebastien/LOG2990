import { assert } from 'chai';
import { CrosswordGenerator } from './crosswordGenerator';
import { Crossword } from '../crossword';

const chai = require('chai');
const expect = chai.expect;

describe('Crossword Generator', () => {
    const crosswordGenerator = new CrosswordGenerator();
    
    it('Should get all the crosswords from the database', ()=> {
        let crosswordsList: Array<Crossword> = [];
        crosswordGenerator.getCrossWords().then(function(data) {
            expect(data.length > 0);
        });
    })

});