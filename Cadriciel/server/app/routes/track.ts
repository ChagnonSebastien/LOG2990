
import * as express from 'express';
import * as mongodb from 'mongodb';

import { DATABASE_URL } from '../config';
import { UpdateTrack } from '../updatetrack';

const trackSchema = require('./trackSchema');
const MongoClient = mongodb.MongoClient;

module Route {

    export class Tracks {

        public getTracks(req: express.Request, res: express.Response, next: express.NextFunction): void {
            MongoClient.connect(DATABASE_URL, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({ 'data': 'connectionError' }));
                } else {
                    db.collection('tracks').find().toArray().then((tracks) => {
                        res.send(JSON.stringify(tracks.map(track => track._id)));
                    });
                }
            });
        }

        public getTrack(req: express.Request, res: express.Response, next: express.NextFunction): void {
            MongoClient.connect(DATABASE_URL, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({ 'data': 'connectionError' }));
                } else {
                    db.collection('tracks').findOne({ _id: req.params.id }).then((track) => {
                        res.send(JSON.stringify(track));
                    });
                }
            });
        }

        public deleteTrack(req: express.Request, res: express.Response, next: express.NextFunction): void {
            MongoClient.connect(DATABASE_URL, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({ 'data': 'connectionError' }));
                } else {
                    db.collection('tracks').findOneAndDelete({ _id: req.params.id }).then((track) => {
                        res.send(JSON.stringify(track));
                    });
                }
            });

        }

        public addTrack(req: express.Request, res: express.Response, next: express.NextFunction) {
            MongoClient.connect(DATABASE_URL, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({ 'data': 'connectionError' }));
                } else {
                    const newTrack = new trackSchema({
                        _id: req.body.name,
                        description: req.body.description,
                        type: req.body.type,
                        trackIntersections: req.body.trackIntersections,
                        puddles: req.body.puddles,
                        potholes: req.body.potholes,
                        boosters: req.body.boosters,
                        rating: req.body.rating,
                        numberOfTimesPlayed: req.body.numberOfTimesPlayed,
                        bestTimes: req.body.bestTimes
                    });

                    db.collection('tracks').update({ _id: req.body.name }, newTrack, { upsert: true });
                    res.send({ 'data': 'success' });
                }
            });
        }

        public endGameUpdate(req: express.Request, res: express.Response, next: express.NextFunction) {
            let tempRating: number;
            let tempBestTimes: { playerName: string, time: number }[];
            let tempNbOfTimesPlayed: number;
            MongoClient.connect(DATABASE_URL, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({ 'data': 'connectionError' }));
                } else {
                    db.collection('tracks').findOne({ _id: req.params.id })
                        .then((trackDB) => {
                            tempRating = UpdateTrack.updateRating(req.body.numberOfTimesPlayed,
                                trackDB.rating,
                                req.body.rating
                            );
                            tempBestTimes = UpdateTrack.updateBestTimes(trackDB.bestTimes, req.body.time);
                            tempNbOfTimesPlayed = trackDB.numberOfTimesPlayed++;

                            db.collection('tracks').update(
                                { _id: req.params.id },
                                {
                                    $set: {
                                        rating: tempRating,
                                        bestTimes: tempBestTimes,
                                        numberOfTimesPlayed: tempNbOfTimesPlayed
                                    }
                                },
                                {
                                    upsert: false
                                });
                            res.send({ 'data': 'success' });
                        });
                }

            });
        }

    }
}

export = Route;
