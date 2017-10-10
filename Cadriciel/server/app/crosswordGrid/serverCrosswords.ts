import * as mongodb from 'mongodb';
import { CrosswordDB } from './crosswordDB';
import { CrosswordGenerator } from '../crossword';
const CrossWord = require('../routes/crossWordSchema');
const mongoose = require('mongoose');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://LOG2990-03:yJ96PW80@parapluie.info.polymtl.ca:27017/LOG2990-03-db';
const crosswordSize = 10;

export class ServerCrosswords {
    private static instance: ServerCrosswords;
    public collection: string;
    private crosswordGenerator: CrosswordGenerator;
    public easyCrosswords: Array<CrosswordDB> = [];
    public normalCrosswords: Array<CrosswordDB> = [];
    public hardCrosswords: Array<CrosswordDB> = [];


    private constructor() {
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
    public getCrossWords(): Promise<Array<CrosswordDB>> {
        let crosswordsList: Array<CrosswordDB>;

        return new Promise<Array<CrosswordDB>>(resolve => {
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
    public async deleteCrossword(crossword: CrosswordDB): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    console.log('error');
                    resolve(false);
                } else {
                    const objId = new mongoose.Types.ObjectId(crossword._id);
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
                        const crosswordGenerated = this.crosswordGenerator.generateCrossword(level);
                        const wordList = Array.from(this.crosswordGenerator.words);
                        const newCrossWord = new CrossWord({
                            crossword: crosswordGenerated,
                            difficulty: level,
                            listOfWords: wordList
                        });

                        db.collection(this.collection).insert(newCrossWord);
                        resolve(true);
                    }
                });
            });
        }
    }

    public async storeServerCrosswords(crosswords: Array<CrosswordDB>): Promise<boolean> {
        for (const element of crosswords) {
            if (element.difficulty === 'hard' && this.hardCrosswords.length < 5) {
                this.hardCrosswords.push(element);
                await this.deleteCrossword(element);
                await this.generateCrossword('hard');
            } else if (element.difficulty === 'normal' && this.normalCrosswords.length < 5) {
                this.normalCrosswords.push(element);
                await this.deleteCrossword(element);
                await this.generateCrossword('normal');
            } else if (element.difficulty === 'easy' && this.easyCrosswords.length < 5) {
                this.easyCrosswords.push(element);
                await this.deleteCrossword(element);
                await this.generateCrossword('easy');
            }
        }

        return new Promise<boolean>((resolve) => {
            if (this.hardCrosswords.length === 5 && this.normalCrosswords.length === 5 && this.easyCrosswords.length === 5) {
                    resolve(true);
                } else {
                    resolve(false);
            }
        });
    }

    public async initializeServerCrossword(): Promise<boolean> {
        const crosswords: Array<CrosswordDB> = await this.getCrossWords();
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

    public async getCrossword(level: string): Promise<CrosswordDB> {
        let crossword: CrosswordDB;
        if (level === 'easy') {
            return new Promise<CrosswordDB>(resolve => {
                this.generateCrossword(level).then((data) => {
                    this.storeOneServerCrossword(level).then((stored) => {
                        crossword = this.easyCrosswords.pop();
                        resolve(crossword);
                    });
                });
            });
        } else if (level === 'normal') {
            return new Promise<CrosswordDB>(resolve => {
                this.generateCrossword(level).then((data) => {
                    this.storeOneServerCrossword(level).then((stored) => {
                        crossword = this.normalCrosswords.pop();
                        resolve(crossword);
                    });
                });
            });
        } else if (level === 'hard') {
            return new Promise<CrosswordDB>(resolve => {
                this.generateCrossword(level).then((data) => {
                    this.storeOneServerCrossword(level).then((stored) => {
                        crossword = this.hardCrosswords.pop();
                        resolve(crossword);
                    });
                });
            });
        }

    }


}
