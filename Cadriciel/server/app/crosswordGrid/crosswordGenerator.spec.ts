import { assert } from 'chai';
import { CrosswordGenerator } from './crosswordGenerator';
import { Crossword } from '../crossword';

const chai = require('chai');
const expect = chai.expect;

describe('Crossword Generator', () => {
    const crosswordGenerator = new CrosswordGenerator();
    let crosswordsList: Array<Crossword> = [];

    it('Should get all the crosswords from the database', (done)=> {
        crosswordGenerator.getCrossWords().then(function(data) {
            crosswordsList = data;
            expect(data.length).to.be.greaterThan(0);
            done();
        });
    })

    it('Should save on server according to difficulties', ()=> {
        crosswordGenerator.storeServerCrosswords(crosswordsList);
        assert(crosswordGenerator.easyCrosswords.length === 5);
        assert(crosswordGenerator.normalCrosswords.length === 5);
        assert(crosswordGenerator.hardCrosswords.length === 5);
    });

    it('Should delete crossword according to id', (done)=> {
        let randomCrossword = crosswordsList[0];
        crosswordGenerator.deleteCrossword(randomCrossword).then(function(data) {
            let deleted = data;
            assert(deleted);
            done();
        });
    });

    it('Sould generate a new easy crossword', (done) => {
        crosswordGenerator.generateCrossword('easy').then(function(data) {
            assert(data);
            done();
        })
    });

    it('Sould generate a new normal crossword', (done) => {
        crosswordGenerator.generateCrossword('normal').then(function(data) {
            assert(data);
            done();
        })
    });

    it('Sould generate a new hard crossword', (done) => {
        crosswordGenerator.generateCrossword('hard').then(function(data) {
            assert(data);
            done();
        })
    });

});