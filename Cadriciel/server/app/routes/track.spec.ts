import { assert } from 'chai';

describe('Track', () => {
    const chai = require('chai');
    const chaiHttp = require('chai-http');
    chai.use(chaiHttp);


    it('Should be true', (done) => {
        assert(true);
        done();
    });
});