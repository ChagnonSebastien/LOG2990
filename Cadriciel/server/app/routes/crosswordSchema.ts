// Import the mongoose module
import * as mongoose from 'mongoose';

// Set up mongoose connection
var mongoDB = 'mongodb://LOG2990-03:yJ96PW80@parapluie.info.polymtl.ca:27017/LOG2990-03-db';
mongoose.connect(mongoDB, { useMongoClient: true });

// Get the default connection
var db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const CwSchema = new mongoose.Schema({

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
        type: [{i: Number, j: Number, word: String, horizontal: Boolean}]
    }
});


const CrossWord = module.exports = mongoose.model('crosswords', CwSchema);
