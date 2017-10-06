import * as express from 'express';
import * as mongodb from 'mongodb';
import * as db from '../db-connection';

module Route {

    export class Authentication {
        private connection: mongodb.Db;

        public login(req: express.Request, res: express.Response, next: express.NextFunction) {
            this.connection = db.get();
            this.connection.collection('login').find().toArray().then((credentials) => {
                if (req.body.password === credentials[0].password) {
                    res.send(JSON.stringify({ 'data': 'authenticated' }));
                } else {
                    res.send(JSON.stringify({ 'data': 'invalid' }));
                }
            });
        }

        public changePassword(req: express.Request, res: express.Response, next: express.NextFunction) {
            this.connection = db.get();
            this.connection.collection('login').find().toArray().then((credentials) => {
                if (req.body.oldPassword === credentials[0].password) {
                    this.connection.collection('login').findOneAndUpdate(
                        { _id: credentials[0]._id },
                        { $set: { password: req.body.newPassword } }
                    );
                    res.send(JSON.stringify({ 'data': 'success' }));
                } else {
                    res.send(JSON.stringify({ 'data': 'invalid' }));
                }
            });
        }
    }
}

export = Route;
