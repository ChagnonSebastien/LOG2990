import { assert } from 'chai';
import { Authentication } from './authentication';

describe('Authentication', () => {
    const apiUrl = 'http://localhost:3000/api';
    let chai = require('chai');
    let chaiHttp = require('chai-http');
    chai.use(chaiHttp);


    it('Should login when password is walleandtomato', (done) => {
        chai.request(apiUrl)
            .post('/login')
            .send({password: 'walleandtomato'})
            .end((err: any, res: any) => {
                assert(JSON.parse(res.text).data == 'authenticated');
                done();
            });
    });

    it('Should not login when password is not walleandtomato', (done) => {
        chai.request(apiUrl)
            .post('/login')
            .send({password: 'blablabla'})
            .end((err: any, res: any) => {
                assert(JSON.parse(res.text).data != 'authenticated');
                done();
            });
    });

    it('Should change password when walleandtomato is entered', (done) => {
        chai.request(apiUrl)
            .post('/changepassword')
            .send({oldPassword: 'walleandtomato', newPassword: 'walleandtomato'})
            .end((err: any, res: any) => {
                assert(JSON.parse(res.text).data == 'success');
                done();
            });
    });

    it('Should not change password when a password other than walleandtomato is entered', (done) => {
        chai.request(apiUrl)
            .post('/changepassword')
            .send({oldPassword: 'blablabla', newPassword: 'walleandtomato'})
            .end((err: any, res: any) => {
                assert(JSON.parse(res.text).data == 'invalid');
                done();
            });
    });
});