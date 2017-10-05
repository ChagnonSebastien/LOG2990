import { assert } from 'chai';
import { CrosswordGenerator } from './crosswordGenerator';
import { CrosswordDB } from './crosswordDB';

const chai = require('chai');
const expect = chai.expect;
const collection = 'crosswords_tests';

describe('Crossword Generator', () => {
    const crosswordGenerator = new CrosswordGenerator(collection);
    let crosswordsList: Array<CrosswordDB> = [];

    it('Should get all the crosswords from the database', (done)=> {
        crosswordGenerator.getCrossWords().then(function(data) {
            crosswordsList = data;
            expect(data.length).to.be.greaterThan(0);
            done();
        });
    })

    it('Should save on server according to difficulties', (done)=> {
        crosswordGenerator.storeServerCrosswords(crosswordsList).then(function(data) {
            assert(crosswordGenerator.easyCrosswords.length === 5);
            assert(crosswordGenerator.normalCrosswords.length === 5);
            assert(crosswordGenerator.hardCrosswords.length === 5);
            done();
        });
    });

    it('Should delete crossword according to id', (done)=> {
        let randomCrossword = crosswordsList[0];
        crosswordGenerator.deleteCrossword(randomCrossword).then(function(data) {
            let deleted = data;
            assert(deleted);
            done();
        });
    });

    it('Should generate a new easy crossword', (done) => {
        crosswordGenerator.generateCrossword('easy').then(function(data) {
            assert(data);
            done();
        })
    });

    it('Should generate a new normal crossword', (done) => {
        crosswordGenerator.generateCrossword('normal').then(function(data) {
            assert(data);
            done();
        })
    });

    it('Should generate a new hard crossword', (done) => {
        crosswordGenerator.generateCrossword('hard').then(function(data) {
            assert(data);
            done();
        })
    });

    it('Should return a crossword of level easy', () => {
        let easyCrossword = crosswordGenerator.getCrossword('easy');
        assert(easyCrossword.difficulty === 'easy');
    });

    it('Should return a crossword of level hard', () => {
        let easyCrossword = crosswordGenerator.getCrossword('hard');
        assert(easyCrossword.difficulty === 'hard');
    });

    it('Should return a crossword of level normal', () => {
        let easyCrossword = crosswordGenerator.getCrossword('normal');
        assert(easyCrossword.difficulty === 'normal');
    });

    it('Should initialize server crosswords by store 5 crosswords for each level', (done) => {
        let testCrosswordGenerator = new CrosswordGenerator(collection);
        testCrosswordGenerator.initializeServerCrossword().then(function(data) {
            assert(data);
            assert(testCrosswordGenerator.easyCrosswords.length === 5);
            assert(testCrosswordGenerator.normalCrosswords.length === 5);
            assert(testCrosswordGenerator.hardCrosswords.length === 5);
            done();
        });
    });

    it('Store an easy crossword on server', (done) => {
        crosswordGenerator.storeOneServerCrossword('easy').then(function(data) {
            assert(data);
            done();
        })
    });

    it('Store a normal crossword on server', (done) => {
        crosswordGenerator.storeOneServerCrossword('normal').then(function(data) {
            assert(data);
            done();
        })
    });

    it('Store a hard crossword on server', (done) => {
        crosswordGenerator.storeOneServerCrossword('hard').then(function(data) {
            assert(data);
            done();
        })
    });


});