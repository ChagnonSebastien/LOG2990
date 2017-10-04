import * as express from 'express';
import * as mongodb from 'mongodb';
import { CrosswordDB } from './crosswordDB';
const CrossWord = require('../routes/crossWordSchema');
var mongoose = require('mongoose');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://LOG2990-03:yJ96PW80@parapluie.info.polymtl.ca:27017/LOG2990-03-db';

export class CrosswordGenerator {

    public easyCrosswords: Array<CrosswordDB> = [];
    public normalCrosswords: Array<CrosswordDB> = [];
    public hardCrosswords: Array<CrosswordDB> = [];

    public async initializeServerCrossword(): Promise<boolean> {
        let crosswords: Array<CrosswordDB> =  await this.getCrossWords();
        let stored: boolean = await this.storeServerCrosswords(crosswords);

        return stored;
    }

    public getCrossWords(): Promise<Array<CrosswordDB>> {
        let crosswordsList: Array<CrosswordDB>;

        return new Promise<Array<CrosswordDB>>(resolve => {
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

    public async storeServerCrosswords(crosswords: Array<CrosswordDB>): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            crosswords.forEach(element => {
                if(element.difficulty === 'hard' && this.hardCrosswords.length < 5) {
                    this.hardCrosswords.push(element);
                    this.deleteCrossword(element);
                    this.generateCrossword('hard');
                } else if (element.difficulty === 'normal' && this.normalCrosswords.length < 5) {
                    this.normalCrosswords.push(element);
                    this.deleteCrossword(element);
                    this.generateCrossword('normal');
                } else if (element.difficulty === 'easy' && this.easyCrosswords.length < 5) {
                    this.easyCrosswords.push(element);
                    this.deleteCrossword(element);
                    this.generateCrossword('easy');
                }
            });

            if(this.hardCrosswords.length === 5 && this.normalCrosswords.length === 5 && this.easyCrosswords.length === 5){
                resolve(true);
            } else {
                resolve(false);
            }
        });
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
    

    public deleteCrossword(crossword: CrosswordDB): Promise<boolean> {
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

    public getCrossword(level:string): CrosswordDB {
        // TODO: store crossword in server
        let crossword: CrosswordDB;
        if(level === 'easy') {
            crossword = this.easyCrosswords.pop();
            this.generateCrossword(level);
            this.storeOneServerCrossword(level);
        } else if (level === 'normal') {
            crossword = this.normalCrosswords.pop();
            this.generateCrossword(level);
            this.storeOneServerCrossword(level);
        } else if (level === 'hard') {
            crossword = this.hardCrosswords.pop();
            this.generateCrossword(level);
            this.storeOneServerCrossword(level);
        }
        return crossword;
    }

    public storeOneServerCrossword(level: string): Promise<boolean> {
        if(level === 'easy' || level === 'normal' || level === 'hard') { 
            return new Promise<boolean>(resolve => {
                MongoClient.connect(url, (err, db) => {
                    if(err) {
                        resolve(false);
                    } else {
                        db.collection('crosswords_tests').findOneAndDelete({"difficulty": level}).then((crossword) => {
                            resolve(crossword.value.difficulty === level);
                        });
                    }
                })
            })
        } else {
            return new Promise<boolean>(resolve => {
                resolve(false);
            })
        }

    }
}