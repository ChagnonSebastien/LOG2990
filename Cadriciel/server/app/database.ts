import * as mongodb from 'mongodb';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DATABASE_URL } from './config';

const MongoClient = mongodb.MongoClient;

export class Database {
    private static database: Database;
    private connection$: mongodb.Db;
    public connected: BehaviorSubject<boolean>;

    private constructor() {
        this.connected = new BehaviorSubject<boolean>(false);
        this.connectToDatabase();
    }

    public static async getInstance(): Promise<Database> {
        if (this.database === undefined) {
            this.database = await new Database();
        }
        return this.database;
    }

    public get connection(): mongodb.Db {
        return this.connection$;
    }

    private connectToDatabase(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            MongoClient.connect(DATABASE_URL, (err, db) => {
                if (err) {
                    console.error('error connecting to database');
                    reject(err);
                    this.connected.next(false);
                    resolve(false);
                } else {
                    this.connection$ = db;
                    this.connected.next(true);
                    resolve(true);
                }
            });
        });
    }
}
