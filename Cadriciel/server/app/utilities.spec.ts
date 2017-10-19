import { expect } from 'chai';
import { Utilities } from './utilities';

describe('Utilities', () => {
    describe('deepCopy(object: any): any { }', () => {
        it('should make a deep copy of the object provided', () => {
            const a = { 'data': 1 };
            const b = Utilities.deepCopy(a);
            expect(a).to.not.equal(b);
        });
    });
});
