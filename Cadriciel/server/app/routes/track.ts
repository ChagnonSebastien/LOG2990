
const Track = require('./trackSchema');
import * as express from 'express';

import * as mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;
const url = 'mongodb://LOG2990-03:yJ96PW80@parapluie.info.polymtl.ca:27017/LOG2990-03-db';

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
                    db.collection('tracks').findOneAndDelete({ trackId: +req.params.id }).then((track) => {
                        res.send(JSON.stringify(track));
                    });
                }
            });

        }

        public updateTrackName(req: express.Request, res: express.Response, next: express.NextFunction) {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({ 'data': 'connectionError' }));
                } else {
                    console.log(req.body.newName);
                    db.collection('tracks').findOneAndUpdate(
                        { trackId: req.body.id },
                        { $set: { name: req.body.newName } }
                    ).then((track) => {
                        res.send(JSON.stringify(track));
                    });
                }
            });

        }
        public updateTrackType(req: express.Request, res: express.Response, next: express.NextFunction) {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({ 'data': 'connectionError' }));
                } else {
                    db.collection('tracks').findOneAndUpdate(
                        { trackId: req.body.id },
                        { $set: { type: req.body.newType } }
                    ).then((track) => {
                        res.send(JSON.stringify(track));
                    });
                }
            });

        }
        public updateTrackDesc(req: express.Request, res: express.Response, next: express.NextFunction) {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({ 'data': 'connectionError' }));
                } else {
                    db.collection('tracks').findOneAndUpdate(
                        { trackId: req.body.id },
                        { $set: { description: req.body.newDesc } }
                    ).then((track) => {
                        res.send(JSON.stringify(track));
                    });
                }
            });

        }

        public addTrack(req: express.Request, res: express.Response, next: express.NextFunction) {

            MongoClient.connect(url, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({ 'data': 'connectionError' }));
                } else {
                    const newTrack = new Track({
                        trackId: req.body.id,
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
