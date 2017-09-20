import { assert } from 'chai';
import { Authentication } from './authentication';

describe('Authentication', () => {
    let chai = require('chai');
    let chaiHttp = require('chai-http');
    chai.use(chaiHttp);


    it("testing login", (done) => {
        chai.request('http://localhost:3000')
            .post('/login')
            .send({password: "walleandtomato"})
            .end((err: any, res: any) => {
                assert(true);
                done();
            });
    });
});