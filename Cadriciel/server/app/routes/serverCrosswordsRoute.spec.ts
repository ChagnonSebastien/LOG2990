import { assert } from 'chai';
import { API_URL } from '../config';

describe('Server Crosswords Route', () => {
    const chai = require('chai');
    const chaiHttp = require('chai-http');
    chai.use(chaiHttp);


    it('Returns an easy crossword', (done) => {
        chai.request(API_URL)
            .get('/crossword/crosswords_tests/easy')
            .end((err: any, res: any) => {
                const crossword = JSON.parse(res.text);
                assert(crossword.difficulty === 'easy');
                done();
            });
    }).timeout(3000);

    it('Returns a normal crossword', (done) => {
        chai.request(API_URL)
            .get('/crossword/crosswords_tests/normal')
            .end((err: any, res: any) => {
                const crossword = JSON.parse(res.text);
                assert(crossword.difficulty === 'normal');
                done();
            });
    }).timeout(3000);

    it('Returns a hard crossword', (done) => {
        chai.request(API_URL)
            .get('/crossword/crosswords_tests/hard')
            .end((err: any, res: any) => {
                const crossword = JSON.parse(res.text);
                assert(crossword.difficulty === 'hard');
                done();
            });
    }).timeout(3000);

    it('Returns a mutated easy crossword', (done) => {
        const listOfWordsIndex = [{ 'i': 0, 'j': 0, 'word': 'sting', 'horizontal': true, '_id': '59e8de1bc222d70714cdb0a6' }];
        chai.request(API_URL)
            .post('/mutate')
            .send({ level: 'easy', wordsWithIndex: listOfWordsIndex })
            .end((err: any, res: any) => {
                const crossword = JSON.parse(res.text);
                assert(crossword.crossword.difficulty === 'easy');
                done();
            });
    });

    it('Returns a mutated normal crossword', (done) => {
        const listOfWordsIndex = [{ 'i': 0, 'j': 0, 'word': 'gig', 'horizontal': true, '_id': '59e8de1bc222d70714cdb0a6' }];
        chai.request(API_URL)
            .post('/mutate')
            .send({ level: 'normal', wordsWithIndex: listOfWordsIndex })
            .end((err: any, res: any) => {
                const crossword = JSON.parse(res.text);
                assert(crossword.crossword.difficulty === 'normal');
                done();
            });
    });

    it('Returns a mutated hard crossword', (done) => {
        const listOfWordsIndex = [{ 'i': 0, 'j': 0, 'word': 'cat', 'horizontal': true, '_id': '59e8de1bc222d70714cdb0a6' }];
        chai.request(API_URL)
            .post('/mutate')
            .send({ level: 'hard', wordsWithIndex: listOfWordsIndex })
            .end((err: any, res: any) => {
                const crossword = JSON.parse(res.text);
                assert(crossword.crossword.difficulty === 'hard');
                done();
            });
    });


});
