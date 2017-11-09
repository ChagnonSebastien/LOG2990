import { assert } from 'chai';
import { CrosswordService } from './crossword.service';
import { CrosswordGenerator } from './crossword-generator';

describe('CrosswordChecker', () => {
    let crosswordGenerator: CrosswordGenerator;
    beforeEach(() => {
        crosswordGenerator = new CrosswordGenerator(10);
    });

    describe('indexOutOfBounds()', () => {
        it('should return true when i or j is smaller than 0', () => {
            assert(CrosswordService.indexesOutOfBounds(-1, -1, 10) === true);
            assert(CrosswordService.indexesOutOfBounds(-1, 0, 10) === true);
            assert(CrosswordService.indexesOutOfBounds(0, -1, 10) === true);
        });

        it('should return true when i or j is greater than or equal to 10', () => {
            assert(CrosswordService.indexesOutOfBounds(0, 10, 10) === true);
            assert(CrosswordService.indexesOutOfBounds(10, 0, 10) === true);
            assert(CrosswordService.indexesOutOfBounds(10, 10, 10) === true);
        });

        it('should return false when i is between 0 and 9', () => {
            assert(CrosswordService.indexesOutOfBounds(0, 0, 10) === false);
            assert(CrosswordService.indexesOutOfBounds(4, 4, 10) === false);
            assert(CrosswordService.indexesOutOfBounds(9, 9, 10) === false);
        });
    });

    describe('verify()', () => {
        it('should check that a blank grid is valid', () => {
            assert(CrosswordService.verify(crosswordGenerator) === true);
        });
    });
});
