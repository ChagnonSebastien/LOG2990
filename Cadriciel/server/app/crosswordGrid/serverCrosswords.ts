import * as mongodb from 'mongodb';
import { Crossword } from '../../../commun/crossword/crossword';
import { CrosswordGenerator } from '../crossword-generator';
const crosswordSchema = require('../routes/crossWordSchema');
const mongoose = require('mongoose');
const MongoClient = mongodb.MongoClient;
// const url = 'mongodb://LOG2990-03:yJ96PW80@parapluie.info.polymtl.ca:27017/LOG2990-03-db';
const url = 'mongodb://admin:walleandtomato@ds123084.mlab.com:23084/skafy';
const crosswordSize = 10;
const maxCrosswordPerLevel = 5;

import { Database } from '../database';

export class ServerCrosswords {
    private static instance: ServerCrosswords;
    public collection: string;
    private crosswordGenerator: CrosswordGenerator;
    public mutatedGrid: Crossword;
    public easyCrosswords: Array<Crossword> = [];
    public normalCrosswords: Array<Crossword> = [];
    public hardCrosswords: Array<Crossword> = [];

    private constructor() {
        this.mutatedGrid = new Crossword();
        this.crosswordGenerator = new CrosswordGenerator(crosswordSize);
    }

    public static getInstance() {
        if (!ServerCrosswords.instance) {
            ServerCrosswords.instance = new ServerCrosswords();
        }
        return ServerCrosswords.instance;
    }

    public setCollection(collection: string) {
        this.collection = collection;
    }

    // get all the crosswords from the database
    public getCrosswordsFromDB(): Promise<Array<Crossword>> {
        let crosswordsList: Array<Crossword>;

        return new Promise<Array<Crossword>>(resolve => {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    crosswordsList = [];
                    resolve(crosswordsList);
                } else {
                    db.collection(this.collection).find().toArray().then((crosswords) => {
                        crosswordsList = crosswords;
                        resolve(crosswordsList);
                    });
                }
            });
        });
    }

    // delete crossword from database
    public async deleteCrossword(crossword: Crossword): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    console.log('error');
                    resolve(false);
                } else {
                    const objId = new mongoose.Types.ObjectId(crossword.id);
                    db.collection(this.collection).deleteOne({ '_id': objId });
                    resolve(true);
                }
            });
        });
    }

    // store new crossword in database only
    public async generateCrossword(level: string): Promise<boolean> {
        if (level === 'easy' || level === 'normal' || level === 'hard') {
            return new Promise<boolean>(resolve => {
                MongoClient.connect(url, (err, db) => {
                    if (err) {
                        resolve(false);
                    } else {
                        const crosswordGenerated = this.crosswordGenerator.newCrossword(level);
                        const wordList = Array.from(this.crosswordGenerator.words);
                        const wordsWithIndex = this.crosswordGenerator.wordsWithIndex;
                        const newCrossWord = new crosswordSchema({
                            crossword: crosswordGenerated,
                            difficulty: level,
                            listOfWords: wordList,
                            wordsWithIndex: wordsWithIndex
                        });

                        db.collection(this.collection).insert(newCrossWord);
                        resolve(true);
                    }
                });
            });
        }
    }

    public async storeServerCrosswords(crosswords: Array<Crossword>): Promise<boolean> {
        for (const element of crosswords) {
            if (element.difficulty === 'hard' && this.hardCrosswords.length < maxCrosswordPerLevel) {
                this.hardCrosswords.push(element);
            } else if (element.difficulty === 'normal' && this.normalCrosswords.length < maxCrosswordPerLevel) {
                this.normalCrosswords.push(element);
            } else if (element.difficulty === 'easy' && this.easyCrosswords.length < maxCrosswordPerLevel) {
                this.easyCrosswords.push(element);
            }
        }

        return new Promise<boolean>((resolve) => {
            if (this.hardCrosswords.length === maxCrosswordPerLevel &&
                this.normalCrosswords.length === maxCrosswordPerLevel &&
                this.easyCrosswords.length === maxCrosswordPerLevel) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    public async initializeServerCrossword(): Promise<boolean> {
        const crosswords: Array<Crossword> = await this.getCrosswordsFromDB();
        const stored: boolean = await this.storeServerCrosswords(crosswords);

        return stored;
    }

    public storeOneServerCrossword(level: string): Promise<boolean> {
        if (level === 'easy' || level === 'normal' || level === 'hard') {
            return new Promise<boolean>(resolve => {
                MongoClient.connect(url, (err, db) => {
                    if (err) {
                        resolve(false);
                    } else {
                        db.collection(this.collection).findOneAndDelete({ 'difficulty': level }).then((crossword) => {
                            if (level === 'easy') {
                                this.easyCrosswords.push(crossword.value);
                            } else if (level === 'normal') {
                                this.normalCrosswords.push(crossword.value);
                            } else {
                                this.hardCrosswords.push(crossword.value);
                            }
                            resolve(crossword.value.difficulty === level);
                        });
                    }
                });
            });
        } else {
            return new Promise<boolean>(resolve => {
                resolve(false);
            });
        }
    }

    public async getCrossword(level: string): Promise<Crossword> {
        let crossword: Crossword;
        return new Promise<Crossword>(resolve => {
            this.generateCrossword(level).then((data) => {
                this.storeOneServerCrossword(level).then((stored) => {
                    if (level === 'easy') {
                        crossword = this.easyCrosswords.pop();
                    } else if (level === 'normal') {
                        crossword = this.normalCrosswords.pop();
                    } else if (level === 'hard') {
                        crossword = this.hardCrosswords.pop();
                    }
                    resolve(crossword);
                });
            });
        });
    }

    public mutate(crossword: Crossword): Crossword {
        this.mutatedGrid.crossword = this.crosswordGenerator.mutate(crossword.difficulty, crossword.wordsWithIndex);
        this.mutatedGrid.difficulty = crossword.difficulty;
        this.mutatedGrid.listOfWords = Array.from(this.crosswordGenerator.words);
        this.mutatedGrid.wordsWithIndex = this.crosswordGenerator.wordsWithIndex;
        return this.mutatedGrid;
    }


}
