import { assert } from 'chai';
import { API_URL } from '../config';

describe('Track', () => {
    const chai = require('chai');
    const chaiHttp = require('chai-http');
    chai.use(chaiHttp);

    it('Should create a new track in the database', (done) => {
        chai.request(API_URL)
            .post('/track')
            .send({
                name: 'testfrsdt',
                description: 'this is a test',
                type: 'easy',
                trackIntersections: [{ 'x': 1, 'y': 1 }],
                puddles: [{ 'segment': 1, 'distance': 1, 'offset': 1 }],
                potholes: [{ 'segment': 1, 'distance': 1, 'offset': 1 }],
                boosters: [{ 'segment': 1, 'distance': 1, 'offset': 1 }]
            }).end((err: any, res: any) => {
                assert(JSON.parse(res.text).data === 'success');
                done();
            });
    });

    it('Should return a list of tracks', (done) => {
        chai.request(API_URL)
            .get('/tracks')
            .end((err: any, res: any) => {
                const tracks = JSON.parse(res.text);
                assert(tracks.length > 0);
                done();
            });
    });

    it('Should change track rating, numberOfTimesPlayed and bestTimes', (done) => {
        chai.request(API_URL)
            .post('/track/update/testfrsdt')
            .send({ numberOfTimesPlayed: 1, rating: 5, time: 7 })
            .end((err: any, res: any) => {
                assert(JSON.parse(res.text).data === 'success');
                done();
            });
    });

    it('Should delete the previously created track', (done) => {
        chai.request(API_URL)
            .delete('/track/testfrsdt')
            .end((err: any, res: any) => {
                const track = JSON.parse(res.text);
                assert(track.value._id === 'testfrsdt');
                done();
            });
    });

});
