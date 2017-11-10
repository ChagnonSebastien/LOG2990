import * as mongodb from 'mongodb';
// const url = 'mongodb://LOG2990-03:yJ96PW80@parapluie.info.polymtl.ca:27017/LOG2990-03-db';
const url = 'mongodb://admin:walleandtomato@ds123084.mlab.com:23084/skafy';
const MongoClient = mongodb.MongoClient;
let connection: mongodb.Db = null;

module DbConnection {
    export function connect(): Promise<mongodb.Db> {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    console.log('connection error');
                    reject(err);
                    return;
                } else {
                    connection = db;
                    resolve(db);
                }
            });
        });
    }

    export function get(): mongodb.Db {
        if (!connection) {
            throw new Error('connection to database not established yet!');
        }
        return connection;
    }
}

export = DbConnection;
