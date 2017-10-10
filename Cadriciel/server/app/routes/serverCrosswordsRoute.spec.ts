import { assert } from 'chai';

describe('Server Crosswords Route', () => {
    const chai = require('chai');
    const chaiHttp = require('chai-http');
    chai.use(chaiHttp);
    const apiUrl = 'http://localhost:3000/api';


    it('Returns an easy crossword', (done) => {
        chai.request(apiUrl)
            .get('/crossword/crosswords_tests/easy')
            .end((err: any, res: any) => {
                const crossword = JSON.parse(res.text);
                assert(crossword.difficulty === 'easy');
                done();
        });
    });

    it('Returns a normal crossword', (done) => {
        chai.request(apiUrl)
            .get('/crossword/crosswords_tests/normal')
            .end((err: any, res: any) => {
                const crossword = JSON.parse(res.text);
                assert(crossword.difficulty === 'normal');
                done();
        });
    });

    it('Returns a normal crossword', (done) => {
        chai.request(apiUrl)
            .get('/crossword/crosswords_tests/hard')
            .end((err: any, res: any) => {
                const crossword = JSON.parse(res.text);
                assert(crossword.difficulty === 'hard');
                done();
        });
    });

});
