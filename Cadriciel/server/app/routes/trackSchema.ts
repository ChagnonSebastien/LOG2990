import * as mongoose from 'mongoose';

mongoose.connect('mongodb://LOG2990-03:yJ96PW80@parapluie.info.polymtl.ca:27017/LOG2990-03-db', { useMongoClient: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const trackSchema = new mongoose.Schema({

    _id:
    {
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
        type: [{ segment: Number, distance: Number, offset: Number }]
    },
    potholes: {
        type: [{ segment: Number, distance: Number, offset: Number }]
    },
    boosters: {
        type: [{ segment: Number, distance: Number, offset: Number }]
    }

});

module.exports = mongoose.model('tracks', trackSchema);
