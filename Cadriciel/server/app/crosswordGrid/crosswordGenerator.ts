import * as express from 'express';
import * as mongodb from 'mongodb';
import { Crossword } from '../crossword';
const CrossWord = require('../routes/crossWordSchema');
var mongoose = require('mongoose');

var MongoClient = mongodb.MongoClient;
var url = 'mongodb://LOG2990-03:yJ96PW80@parapluie.info.polymtl.ca:27017/LOG2990-03-db';
export class CrosswordGenerator {

    public easyCrosswords: Array<Crossword> = [];
    public normalCrosswords: Array<Crossword> = [];
    public hardCrosswords: Array<Crossword> = [];

    public getCrossWords(): Promise<Array<Crossword>> {
        let crosswordsList: Array<Crossword>;

        return new Promise<Array<Crossword>>(resolve => {
            MongoClient.connect(url, (err, db) => {
                if(err) {
                    crosswordsList = [];
                    resolve(crosswordsList);
                } else {
                    db.collection('crosswords_tests').find().toArray().then((crosswords) => {
                        crosswordsList = crosswords;
                        resolve(crosswordsList);
                    });
                }
            })
        });
    }

    public storeServerCrosswords(crosswords: Array<any>): void {
        crosswords.forEach(element => {
            if(element.difficulty = 'hard' && this.hardCrosswords.length < 5) {
                this.hardCrosswords.push(element);
            }
            else if (element.difficulty = 'normal' && this.normalCrosswords.length < 5) {
                this.normalCrosswords.push(element);
            } else if (element.difficulty = 'easy' && this.easyCrosswords.length < 5) {
                this.easyCrosswords.push(element);
            }
        });

        //delete chosen crossword from database

        //generate 5 easy crossword
        //generate 5 medium crossword
        //generate 5 hard crossword

    }

    public generateCrossword(level: string): Promise<boolean> {
        if(level === 'easy' || level === 'normal' || level === 'hard') {
            return new Promise<boolean>(resolve => {
                MongoClient.connect(url, (err, db) => {
                    if (err) {
                        resolve(false);
                    } else {
                        let newCrossWord = new CrossWord({
                            crossword: [['test', 'test'],['test2', 'test2']],
                            difficulty: level,
                            listOfWords: ['test1', 'test2']
                        });

                        db.collection('crosswords_tests').insert(newCrossWord);
                        resolve(true);
                    }
                });
           });
        }
    }
    

    public deleteCrossword(crossword: Crossword): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    console.log("error");
                    resolve(false);
                } else {
                    const objId = new mongoose.Types.ObjectId(crossword._id);
                    db.collection('crosswords_tests').deleteOne({ "_id": objId });
                    resolve(true);
                }
            });
        }); 
    }
}