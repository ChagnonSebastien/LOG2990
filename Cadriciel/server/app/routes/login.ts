import * as express from 'express';

import * as mongodb from 'mongodb';

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://LOG2990-03:yJ96PW80@parapluie.info.polymtl.ca:27017/LOG2990-03-db';

module Route {

    export class Login {

        public authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({"data": "connectionError"}));
                } else {
                    db.collection('login').find().toArray().then((credentials) => {
                        if (req.body.password == credentials[0].password) {
                            res.send(JSON.stringify({"data": "authenticated"}));
                        } else {
                            res.send(JSON.stringify({"data": "invalid"}));
                        }
                    });
                }
            });
        }
    }
}

export = Route;