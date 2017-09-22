import * as express from 'express';
import * as mongodb from 'mongodb';
const CrossWord = require('./crossWordSchema');
var mongoose = require('mongoose');

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://LOG2990-03:yJ96PW80@parapluie.info.polymtl.ca:27017/LOG2990-03-db';

module Route {

    export class CrossWords {

        public getCrossWords(req: express.Request, res: express.Response, next: express.NextFunction) {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({"data": "connectionError"}));
                } else {
                    
                    db.collection('crosswords').find().toArray().then((crosswords) => {  
                     res.json(crosswords);     
                    });
                }
            });
        }

        public deleteCrossWord(req: express.Request, res: express.Response, next: express.NextFunction) {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    console.log("error");
                    res.send(JSON.stringify({"data": "connectionError"}));
                } else {
                    console.log(req.params.id);
                    const objId = new mongoose.Types.ObjectId(req.params.id);
                    db.collection('crosswords').deleteOne({"_id": objId});
                    res.json({msg: 'Crossword deleted successfully'});
                }

            });

        }

       
        public addCrossWord(req: express.Request, res: express.Response, next: express.NextFunction){

            MongoClient.connect(url, (err, db) => {
                if (err) {
                    res.send(JSON.stringify({"data": "connectionError"}));
                } else {
                    let newCrossWord = new CrossWord({
                        crossword: req.body.crossword,
                        difficulty: req.body.difficulty,
                        listOfWords:req.body.listOfWords
                    });

                    db.collection('crosswords').insert(newCrossWord);
                    res.json({msg: 'Crossword added successfully'});    
                }
        });

      }

    }
}

export = Route;