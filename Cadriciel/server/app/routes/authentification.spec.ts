import { assert } from 'chai';

describe('Authentication', () => {
    const chai = require('chai');
    const chaiHttp = require('chai-http');
    chai.use(chaiHttp);


    it('testing login', (done) => {
        chai.request('http://localhost:3000')
            .post('/login')
            .send({password: 'walleandtomato'})
            .end((err: any, res: any) => {
                assert(true);
                done();
            });
    });
});
