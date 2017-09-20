import * as express from 'express';

import * as mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;
const url = 'mongodb://LOG2990-03:yJ96PW80@parapluie.info.polymtl.ca:27017/LOG2990-03-db';

module Route {

    export class Authentication {

        public login(req: express.Request, res: express.Response, next: express.NextFunction) {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({ 'data': 'connectionError' }));
                } else {
                    db.collection('login').find().toArray().then((credentials) => {
                        if (req.body.password === credentials[0].password) {
                            res.send(JSON.stringify({ 'data': 'authenticated' }));
                        } else {
                            res.send(JSON.stringify({ 'data': 'invalid' }));
                        }
                    });
                }
            });
        }

        public changePassword(req: express.Request, res: express.Response, next: express.NextFunction) {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({ 'data': 'connectionError' }));
                } else {
                    db.collection('login').find().toArray().then((credentials) => {
                        if (req.body.oldPassword === credentials[0].password) {
                            db.collection('login').findOneAndUpdate(
                                { _id: credentials[0]._id },
                                { $set: { password: req.body.newPassword } }
                            );
                            res.send(JSON.stringify({ 'data': 'success' }));
                        } else {
                            res.send(JSON.stringify({ 'data': 'invalid' }));
                        }
                    });
                }
            });
        }
    }
}

export = Route;
