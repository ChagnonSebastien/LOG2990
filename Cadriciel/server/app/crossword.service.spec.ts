import { expect } from 'chai';
import { CrosswordService } from './crossword.service';
import { CrosswordGenerator } from './crossword';

describe('CrosswordChecker', () => {
    let crosswordGenerator: CrosswordGenerator;
    beforeEach(() => {
        crosswordGenerator = new CrosswordGenerator(10);
    });

    describe('indexOutOfBounds()', () => {
        it('should return true when i or j is smaller than 0', () => {
            expect(CrosswordService.indexesOutOfBounds(-1, -1, 10)).to.be.true;
            expect(CrosswordService.indexesOutOfBounds(-1, 0, 10)).to.be.true;
            expect(CrosswordService.indexesOutOfBounds(0, -1, 10)).to.be.true;
        });

        it('should return true when i or j is greater than or equal to 10', () => {
            expect(CrosswordService.indexesOutOfBounds(0, 10, 10)).to.be.true;
            expect(CrosswordService.indexesOutOfBounds(10, 0, 10)).to.be.true;
            expect(CrosswordService.indexesOutOfBounds(10, 10, 10)).to.be.true;
        });

        it('should return false when i is between 0 and 9', () => {
            expect(CrosswordService.indexesOutOfBounds(0, 0, 10)).to.be.false;
            expect(CrosswordService.indexesOutOfBounds(4, 4, 10)).to.be.false;
            expect(CrosswordService.indexesOutOfBounds(9, 9, 10)).to.be.false;
        });
    });

    describe('verify()', () => {
        it('should check that a blank grid is valid', () => {
            expect(CrosswordService.verify(crosswordGenerator)).to.be.true;
        });
    });
});
