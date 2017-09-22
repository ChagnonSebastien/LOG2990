import { assert } from 'chai';

describe('Crossword', () => {
    const chai = require('chai');
    const chaiHttp = require('chai-http');
    chai.use(chaiHttp);
    const apiUrl = 'http://localhost:3000/api';

    it('Should create a new crossword in the database', (done) => {
        chai.request(apiUrl)
            .post('/crosswords')
            .send({
                "crossword":[["test","test"],["test2","test2"]],
                "difficulty":"hard",
                "listOfWords":["test2","test1"]
            }).end((err: any, res: any) => {
                assert(JSON.parse(res.text).data === 'Crossword added successfully');
                done();
            });
    });

    

    it('Should return a list of crosswords', (done) => {
        chai.request(apiUrl)
            .get('/crosswords')
            .end((err: any, res: any) => {
                let tracks = JSON.parse(res.text);
                assert(tracks.length > 0);
                done();
            });
    });

    it('Should delete the previously created track', (done) => {
        chai.request(apiUrl)
            .delete('crosswords:id')
            .end((err: any, res: any) => {
                let crossword = JSON.parse(res.text);
                assert(crossword.value.difficulty== "hard");
                done();
            });
    });
});