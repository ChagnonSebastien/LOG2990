import * as mongoose from 'mongoose';

mongoose.connect('mongodb://LOG2990-03:yJ96PW80@parapluie.info.polymtl.ca:27017/LOG2990-03-db', { useMongoClient: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const trackSchema = new mongoose.Schema({

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
