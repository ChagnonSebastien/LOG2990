
const Track = require('./trackSchema');
import * as express from 'express';

import * as mongodb from 'mongodb';

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://LOG2990-03:yJ96PW80@parapluie.info.polymtl.ca:27017/LOG2990-03-db';

module Route {

    export class Tracks {

        public getTracks(req: express.Request, res: express.Response, next: express.NextFunction) {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({ 'data': 'connectionError' }));
                } else {
                    db.collection('tracks').find().toArray().then((tracks) => {
                        res.send(JSON.stringify(tracks));
                    });
                }
            });
        }

        public deleteTrack(req: express.Request, res: express.Response, next: express.NextFunction) {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({ 'data': 'connectionError' }));
                } else {
                    db.collection('tracks').remove({ id: req.params.id });
                    res.json({ msg: 'Track deleted successfully' })
                }

            });

        }

        public updateTrackName(req: express.Request, res: express.Response, next: express.NextFunction) {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({ 'data': 'connectionError' }));
                } else {


                    db.collection('tracks').findOneAndUpdate({ id: req.body.id }, { $set: { name: req.body.newName } });
                    res.json({ msg: 'Track updated successfully' })
                }
            });

        }
        public updateTrackType(req: express.Request, res: express.Response, next: express.NextFunction) {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({ 'data': 'connectionError' }));
                } else {


                    db.collection('tracks').findOneAndUpdate({ id: req.body.id }, { $set: { type: req.body.newType } });
                    res.json({ msg: 'Track updated successfully' })
                }
            });

        }
        public updateTrackDesc(req: express.Request, res: express.Response, next: express.NextFunction) {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({ 'data': 'connectionError' }));
                } else {


                    db.collection('tracks').findOneAndUpdate({ id: req.body.id }, { $set: { description: req.body.newDesc } });
                    res.json({ msg: 'Track updated successfully' })
                }
            });

        }

        public addTrack(req: express.Request, res: express.Response, next: express.NextFunction) {

            MongoClient.connect(url, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({ 'data': 'connectionError' }));
                } else {
                    let newTrack = new Track({
                        id: req.body.id,
                        name: req.body.name,
                        description: req.body.description,
                        type: req.body.type,
                        trackIntersections: req.body.trackIntersections,
                        puddles: req.body.puddles,
                        potholes: req.body.potholes,
                        boosters: req.body.boosters
                    });

                    db.collection('tracks').insert(newTrack);
                    res.send({ 'data': 'success' });
                }
            });

        }

    }
}

export = Route;