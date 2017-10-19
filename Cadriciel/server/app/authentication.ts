import * as mongodb from 'mongodb';
const db = require('./db-connection');

export class Authentication {
    private connection: mongodb.Db;
    private collection: string;

    constructor(collection: string) {
        this.collection = collection;
    }

    public login(password: string): boolean {
        console.log(db);
        this.connection = db.get();
        console.log(this.connection);
        let authenticated: boolean;

        this.connection.collection(this.collection).find().toArray().then((credentials) => {
            if (password === credentials[0].password) {
                authenticated = true;
            } else {
                authenticated = false;
            }
        });

        return authenticated;
    }

}
