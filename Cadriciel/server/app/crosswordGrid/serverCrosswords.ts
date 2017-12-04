import * as mongodb from 'mongodb';

import { Crossword } from '../../../commun/crossword/crossword';
import { CrosswordGenerator } from '../crossword-generator';

import { DATABASE_URL, CROSSWORD_GRID_SIZE, MAX_CROSSWORDS_PER_LEVEL } from '../config';

const crosswordSchema = require('../routes/crossWordSchema');
const mongoose = require('mongoose');
const MongoClient = mongodb.MongoClient;

export class ServerCrosswords {
    private static instance: ServerCrosswords;
    public collection: string;
    private crosswordGenerator: CrosswordGenerator;
    public mutatedGrid: Crossword;
    public easyCrosswords: Array<Crossword>;
    public normalCrosswords: Array<Crossword>;
    public hardCrosswords: Array<Crossword>;

    private constructor() {
        this.easyCrosswords = new Array<Crossword>();
        this.normalCrosswords = new Array<Crossword>();
        this.hardCrosswords = new Array<Crossword>();
        this.mutatedGrid = new Crossword();
        this.crosswordGenerator = new CrosswordGenerator(CROSSWORD_GRID_SIZE);
    }

    public static getInstance(): ServerCrosswords {
        if (!ServerCrosswords.instance) {
            ServerCrosswords.instance = new ServerCrosswords();
        }
        return ServerCrosswords.instance;
    }

    public setCollection(collection: string): void {
        this.collection = collection;
    }

    public getCrosswordsFromDB(): Promise<Array<Crossword>> {
        let crosswordsList: Array<Crossword>;

        return new Promise<Array<Crossword>>(resolve => {
            MongoClient.connect(DATABASE_URL, (err, db) => {
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

    public async deleteCrossword(crossword: Crossword): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            MongoClient.connect(DATABASE_URL, (err, db) => {
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

    public async generateCrossword(level: string): Promise<boolean> {
        if (level === 'easy' || level === 'normal' || level === 'hard') {
            return new Promise<boolean>(resolve => {
                MongoClient.connect(DATABASE_URL, (err, db) => {
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
            if (element.difficulty === 'hard' && this.hardCrosswords.length < MAX_CROSSWORDS_PER_LEVEL) {
                this.hardCrosswords.push(element);
            } else if (element.difficulty === 'normal' && this.normalCrosswords.length < MAX_CROSSWORDS_PER_LEVEL) {
                this.normalCrosswords.push(element);
            } else if (element.difficulty === 'easy' && this.easyCrosswords.length < MAX_CROSSWORDS_PER_LEVEL) {
                this.easyCrosswords.push(element);
            }
        }

        return new Promise<boolean>((resolve) => {
            if (this.hardCrosswords.length === MAX_CROSSWORDS_PER_LEVEL &&
                this.normalCrosswords.length === MAX_CROSSWORDS_PER_LEVEL &&
                this.easyCrosswords.length === MAX_CROSSWORDS_PER_LEVEL) {
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
                MongoClient.connect(DATABASE_URL, (err, db) => {
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
