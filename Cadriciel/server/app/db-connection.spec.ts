import { expect } from 'chai';
import * as mongodb from 'mongodb';

const db = require('./db-connection');
describe('Database Connection', () => {

    it('Should connect to database and should be able to get the connection', () => {
        db.connect().then(function(c: mongodb.Db) {
            expect(c).to.be.instanceOf(mongodb.Db);
            expect(db.get()).to.be.instanceOf(mongodb.Db);
        });
    });

});
