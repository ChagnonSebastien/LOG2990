import { assert } from 'chai';
import { ServerCrosswords } from './serverCrosswords';
import { CrosswordDB } from './crosswordDB';

const chai = require('chai');
const expect = chai.expect;
const collection = 'crosswords_tests';

describe('Server Crosswords', () => {
    const serverCrosswords = ServerCrosswords.getInstance();
    serverCrosswords.setCollection(collection);
    let crosswordsList: Array<CrosswordDB> = [];

    it('Should get all the crosswords from the database', (done) => {
        serverCrosswords.getCrosswordsFromDB().then(function (data) {
            crosswordsList = data;
            expect(data.length).to.be.greaterThan(0);
            done();
        });
    });

    it('Should delete crossword according to id', (done) => {
        const crosswordToDelete = crosswordsList[0];
        serverCrosswords.deleteCrossword(crosswordToDelete).then(function (data) {
            assert(data);
            done();
        });
    });

    it('Should generate a new easy crossword', (done) => {
        serverCrosswords.generateCrossword('easy').then(function (data) {
            assert(data);
            done();
        });
    }).timeout(5000);

    it('Should generate a new normal crossword', (done) => {
        serverCrosswords.generateCrossword('normal').then(function (data) {
            assert(data);
            done();
        });
    }).timeout(5000);

    it('Should generate a new hard crossword', (done) => {
        serverCrosswords.generateCrossword('hard').then(function (data) {
            assert(data);
            done();
        });
    }).timeout(5000);

    it('Should save on server according to difficulties', (done) => {
        serverCrosswords.getCrosswordsFromDB().then(function (data) {
            crosswordsList = data;
            serverCrosswords.storeServerCrosswords(crosswordsList).then(function (stored) {
                serverCrosswords.getCrosswordsFromDB().then(function (c) {
                    const storedCrosswords: Array<CrosswordDB> = c;
                    assert(crosswordsList.length === storedCrosswords.length);
                    assert(serverCrosswords.easyCrosswords.length === 5);
                    assert(serverCrosswords.normalCrosswords.length === 5);
                    assert(serverCrosswords.hardCrosswords.length === 5);
                    done();
                });
            });
        });
    }).timeout(15000);

    it('Should initialize server crosswords by storing 5 crosswords for each level', (done) => {
        serverCrosswords.initializeServerCrossword().then(function (data) {
            assert(data);
            assert(serverCrosswords.easyCrosswords.length === 5);
            assert(serverCrosswords.normalCrosswords.length === 5);
            assert(serverCrosswords.hardCrosswords.length === 5);
            done();
        });
    }).timeout(8000);


    it('Store an easy crossword on server', (done) => {
        serverCrosswords.storeOneServerCrossword('easy').then(function (data) {
            assert(data);
            assert(serverCrosswords.easyCrosswords.length === 6);
            done();
        });
    });

    it('Store a normal crossword on server', (done) => {
        serverCrosswords.storeOneServerCrossword('normal').then(function (data) {
            assert(data);
            assert(serverCrosswords.normalCrosswords.length === 6);
            done();
        });
    });

    it('Store a hard crossword on server', (done) => {
        serverCrosswords.storeOneServerCrossword('hard').then(function (data) {
            assert(data);
            assert(serverCrosswords.hardCrosswords.length === 6);
            done();
        });
    });

    it('Should return a crossword of level easy', (done) => {
        serverCrosswords.getCrossword('easy').then(function (data) {
            assert(data.difficulty === 'easy');
            assert(serverCrosswords.easyCrosswords.length === 6);
            done();
        });
    }).timeout(10000);

    it('Should return a crossword of level hard', (done) => {
        serverCrosswords.getCrossword('hard').then(function (data) {
            assert(data.difficulty === 'hard');
            assert(serverCrosswords.hardCrosswords.length === 6);
            done();
        });
    }).timeout(10000);

    it('Should return a crossword of level normal', (done) => {
        serverCrosswords.getCrossword('normal').then(function (data) {
            assert(data.difficulty === 'normal');
            assert(serverCrosswords.normalCrosswords.length === 6);
            done();
        });
    }).timeout(10000);

    // reset collection to crosswords
    serverCrosswords.setCollection('crosswords');
});
