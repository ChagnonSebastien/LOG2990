import * as mongodb from 'mongodb';
let url = 'mongodb://LOG2990-03:yJ96PW80@parapluie.info.polymtl.ca:27017/LOG2990-03-db';
let MongoClient = mongodb.MongoClient;
let connection: mongodb.Db = null;

module DbConnection {
    export function connect(): Promise<mongodb.Db> {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    reject(err);
                    return;
                } else {
                    connection = db;
                    resolve(db);
                }
            });
        });
    }

    export function get() {
        if (!connection) {
            throw new Error('connection to database to established yet!');
        }
        return connection;
    }
}

export = DbConnection;