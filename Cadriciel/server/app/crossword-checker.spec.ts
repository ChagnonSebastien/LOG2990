import { expect } from 'chai';
import { CrosswordChecker } from './crossword-checker';
import { CrosswordGenerator } from './crossword';

describe('CrosswordChecker', () => {
    const crosswordGenerator = new CrosswordGenerator(10);
    beforeEach(() => {
        crosswordGenerator.reset();
    });

    describe('verify()', () => {
        it('should check if all the lines are valid', () => {
            expect(CrosswordChecker.verify(crosswordGenerator)).to.be.true;
        });
    });
});
