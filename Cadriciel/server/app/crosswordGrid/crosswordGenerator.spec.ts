import { assert } from 'chai';
import { CrosswordGenerator } from './crosswordGenerator';
import { CrosswordDB } from './crosswordDB';

const chai = require('chai');
const expect = chai.expect;
const collection = 'crosswords_tests';

describe('Crossword Generator', () => {
    const crosswordGenerator = new CrosswordGenerator(collection);
    let crosswordsList: Array<CrosswordDB> = [];

    it('Should get all the crosswords from the database', (done) => {
        crosswordGenerator.getCrossWords().then(function (data) {
            crosswordsList = data;
            expect(data.length).to.be.greaterThan(0);
            done();
        });
    });

    it('Should delete crossword according to id', (done) => {
        const crosswordToDelete = crosswordsList[0];
        crosswordGenerator.deleteCrossword(crosswordToDelete).then(function (data) {
            assert(data);
            done();
        });
    });

    it('Should generate a new easy crossword', (done) => {
        crosswordGenerator.generateCrossword('easy').then(function (data) {
            assert(data);
            done();
        });
    });

    it('Should generate a new normal crossword', (done) => {
        crosswordGenerator.generateCrossword('normal').then(function (data) {
            assert(data);
            done();
        });
    });

    it('Should generate a new hard crossword', (done) => {
        crosswordGenerator.generateCrossword('hard').then(function (data) {
            assert(data);
            done();
        });
    });

    it('Should save on server according to difficulties', (done) => {
        crosswordGenerator.getCrossWords().then(function (data) {
            crosswordsList = data;
            crosswordGenerator.storeServerCrosswords(crosswordsList).then(function (stored) {
                crosswordGenerator.getCrossWords().then(function (c) {
                    const storedCrosswords: Array<CrosswordDB> = c;
                    assert(crosswordsList.length === storedCrosswords.length);
                    assert(crosswordGenerator.easyCrosswords.length === 5);
                    assert(crosswordGenerator.normalCrosswords.length === 5);
                    assert(crosswordGenerator.hardCrosswords.length === 5);
                    done();
                });
            });
        });
    }).timeout(8000);

    it('Should initialize server crosswords by storing 5 crosswords for each level', (done) => {
        const testCrosswordGenerator = new CrosswordGenerator(collection);
        testCrosswordGenerator.initializeServerCrossword().then(function (data) {
            assert(data);
            assert(testCrosswordGenerator.easyCrosswords.length === 5);
            assert(testCrosswordGenerator.normalCrosswords.length === 5);
            assert(testCrosswordGenerator.hardCrosswords.length === 5);
            done();
        });
    }).timeout(8000);


    it('Store an easy crossword on server', (done) => {
        crosswordGenerator.storeOneServerCrossword('easy').then(function (data) {
            assert(data);
            assert(crosswordGenerator.easyCrosswords.length === 6);
            done();
        });
    });

    it('Store a normal crossword on server', (done) => {
        crosswordGenerator.storeOneServerCrossword('normal').then(function (data) {
            assert(data);
            assert(crosswordGenerator.normalCrosswords.length === 6);
            done();
        });
    });

    it('Store a hard crossword on server', (done) => {
        crosswordGenerator.storeOneServerCrossword('hard').then(function (data) {
            assert(data);
            assert(crosswordGenerator.hardCrosswords.length === 6);
            done();
        });
    });

    it('Should return a crossword of level easy', () => {
        crosswordGenerator.getCrossword('easy').then(function (data) {
            assert(data.difficulty === 'easy');
            assert(crosswordGenerator.easyCrosswords.length === 6);
        });
    });

    it('Should return a crossword of level hard', () => {
        crosswordGenerator.getCrossword('hard').then(function (data) {
            assert(data.difficulty === 'hard');
            assert(crosswordGenerator.hardCrosswords.length === 6);
        });
    });

    it('Should return a crossword of level normal', () => {
        crosswordGenerator.getCrossword('normal').then(function (data) {
            assert(data.difficulty === 'normal');
            assert(crosswordGenerator.normalCrosswords.length === 6);
        });
    });
});
