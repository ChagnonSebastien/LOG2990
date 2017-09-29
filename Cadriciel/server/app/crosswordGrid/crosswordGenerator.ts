import * as express from 'express';
import * as mongodb from 'mongodb';
import { Crossword } from '../crossword';
const CrossWord = require('../routes/crossWordSchema');
var mongoose = require('mongoose');

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://LOG2990-03:yJ96PW80@parapluie.info.polymtl.ca:27017/LOG2990-03-db';
export class CrosswordGenerator {

    public easyCrosswords: Array<Crossword>;
    public normalCrosswords: Array<Crossword>;
    public hardCrosswords: Array<Crossword>;

    public getCrossWords(): Promise<Array<Crossword>> {
        let crosswordsList: Array<Crossword>;

        return new Promise<Array<Crossword>>(resolve => {
            MongoClient.connect(url, (err, db) => {
                if(err) {
                    crosswordsList = [];
                    resolve(crosswordsList);
                } else {
                    db.collection('crosswords').find().toArray().then((crosswords) => {
                        crosswordsList = crosswords;
                        resolve(crosswordsList);
                    });
                }
            })
        });
    }

}