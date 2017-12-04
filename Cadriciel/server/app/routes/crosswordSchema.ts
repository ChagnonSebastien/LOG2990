import * as mongoose from 'mongoose';
import { DATABASE_URL, CROSSWORD_COLLECTION } from '../config';

mongoose.connect(
    DATABASE_URL,
    { useMongoClient: true }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const crosswordSchema = new mongoose.Schema({

    crossword:
        {
            type: [[String]]
        },
    difficulty: {
        type: String
    },
    listOfWords: {
        type: [String]
    },
    wordsWithIndex: {
        type: [{ i: Number, j: Number, word: String, horizontal: Boolean }]
    }
});


module.exports = mongoose.model(CROSSWORD_COLLECTION, crosswordSchema);
