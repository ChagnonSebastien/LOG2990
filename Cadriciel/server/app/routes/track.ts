
const trackSchema = require('./trackSchema');
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

        public getTrack(req: express.Request, res: express.Response, next: express.NextFunction) {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({ 'data': 'connectionError' }));
                } else {
                    db.collection('tracks').findOne({ _id: req.params.id }).then((track) => {
                        res.send(JSON.stringify(track));
                    });
                }
            });
        }

        public deleteTrack(req: express.Request, res: express.Response, next: express.NextFunction) {
            MongoClient.connect(url, (err, db) => {
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

            MongoClient.connect(url, (err, db) => {
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
                        bestTimes: req.body.bestTimes,
                        numberOfTimesPlayed: req.body.numberOfTimesPlayed
                    });

                    db.collection('tracks').update({ _id: req.body.name }, newTrack, { upsert : true });
                    res.send({ 'data': 'success' });
                }
            });

        }
        
        public updateRating (numberOfTimesPlayed: number, oldRating: number, newRating: number): number {
             return (numberOfTimesPlayed * oldRating + newRating ) / (numberOfTimesPlayed + 1);  
        }

        public updateBestTimes (arrayBestTimes: number[], newtime: number ) { 
            const fifthBestTimes = 5;
            arrayBestTimes.sort((a, b) => { 
                  return a - b;
            })
              arrayBestTimes = arrayBestTimes.slice(0, fifthBestTimes);
              for( let time = 0; time < arrayBestTimes.length - 1; time++) {
                if(newtime < arrayBestTimes[time]){
                    arrayBestTimes[time + 1] = arrayBestTimes[time];
                    arrayBestTimes[time] = newtime;
                    return arrayBestTimes;
                }
              }             
        }

        public endGameUpdate(req: express.Request, res: express.Response, next: express.NextFunction) {
            let tempRating: number;
            let tempBestTimes: number[];
            let tempNbOfTimesPlayed: number;

            MongoClient.connect(url, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({ 'data': 'connectionError' }));
                } else {
                    db.collection('track').findOne({ _id: req.params.update.name })
                        .then((trackDB) => {
                            tempRating = this.updateRating(req.body.numberOfTimesPlayed, trackDB.rating, req.body.rating );
                            tempBestTimes = this.updateBestTimes(trackDB.bestTimes, req.body.time);
                            tempNbOfTimesPlayed = trackDB.numberOfTimesPlayed++;
                            
                            db.collection('tracks').update(
                                { id: req.params.update.name }, 
                                { rating: tempRating,
                                  bestTimes: tempBestTimes,
                                  numberOfTimePlayed: tempNbOfTimesPlayed },
                                { upsert: false
                                });  
                        })                
                }
                 
            });
        }
        
    }
}

export = Route;
