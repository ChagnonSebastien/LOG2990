import * as mongoose from 'mongoose';
import { DATABASE_URL } from '../config';

mongoose.connect(DATABASE_URL, { useMongoClient: true });
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
    },
    rating: {
        type: Number
    },
    bestTimes: {
        type: [{ playerName: String, time: Number }]
    },
    numberOfTimesPlayed: {
        type: Number
    }

});

module.exports = mongoose.model('tracks', trackSchema);
