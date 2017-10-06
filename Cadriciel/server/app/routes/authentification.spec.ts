import { assert } from 'chai';

describe('Authentication', () => {
    const apiUrl = 'http://localhost:3000/api';
    const chai = require('chai');
    const chaiHttp = require('chai-http');
    chai.use(chaiHttp);
    const truePassWord = 'walleandtomato';
    const falsePassWord = 'blablabla';

    it('Should login when password is walleandtomato', (done) => {
        chai.request(apiUrl)
            .post('/login')
            .send({password: truePassWord})
            .end((err: any, res: any) => {
                assert(JSON.parse(res.text).data === 'authenticated');
                done();
            });
    });

    it('Should not login when password is not walleandtomato', (done) => {
        chai.request(apiUrl)
            .post('/login')
            .send({password: falsePassWord})
            .end((err: any, res: any) => {
                assert(JSON.parse(res.text).data !== 'authenticated');
                done();
            });
    });

    it('Should change password when walleandtomato is entered', (done) => {
        chai.request(apiUrl)
            .post('/changepassword')
            .send({oldPassword: truePassWord, newPassword: 'walleandtomato'})
            .end((err: any, res: any) => {
                assert(JSON.parse(res.text).data === 'success');
                done();
            });
    });

    it('Should not change password when a password other than walleandtomato is entered', (done) => {
        chai.request(apiUrl)
            .post('/changepassword')
            .send({oldPassword: falsePassWord, newPassword: truePassWord})
            .end((err: any, res: any) => {
                assert(JSON.parse(res.text).data === 'invalid');
                done();
            });
    });
});
