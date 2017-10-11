import { expect } from 'chai';
import { CrosswordChecker } from './crossword-checker';

describe('CrosswordChecker', () => {
    describe('check()', () => {
        it('should check if all the lines are valid', () => {
            const grid = new Array<Array<string>>();
            expect(CrosswordChecker.verify(grid)).to.be.true;
        });
    });
});
