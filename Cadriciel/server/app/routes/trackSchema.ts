// Import the mongoose module
var mongoose = require('mongoose');

// Set up mongoose connection
var mongoDB = 'mongodb://LOG2990-03:yJ96PW80@parapluie.info.polymtl.ca:27017/LOG2990-03-db';
mongoose.connect(mongoDB, { useMongoClient: true });

// Get the default connection
var db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const trackSchema = mongoose.Schema({

    trackId:
    {
        type: Number
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    type: {
        type: String
    },
    trackIntersections: {
        type: [{ x: Number, y: Number }]
    },
    puddles: {
        type: [{ distance: Number, offset: Number }]
    },
    potholes: {
        type: [{ distance: Number, offset: Number }]
    },
    boosters: {
        type: [{ distance: Number, offset: Number }]
    }

});

const Track = module.exports = mongoose.model('tracks', trackSchema);
