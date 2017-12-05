import { assert } from 'chai';
import { CrosswordVerifier } from './crossword-verifier';
import { CrosswordGenerator } from './crossword-generator';

import { CROSSWORD_GRID_SIZE } from './config';

describe('CrosswordChecker', () => {
    let crosswordGenerator: CrosswordGenerator;
    beforeEach(() => {
        crosswordGenerator = new CrosswordGenerator(CROSSWORD_GRID_SIZE);
    });

    describe('indexOutOfBounds()', () => {
        it('should return true when i or j is smaller than 0', () => {
            assert(CrosswordVerifier.indexesOutOfBounds(-1, -1, CROSSWORD_GRID_SIZE) === true);
            assert(CrosswordVerifier.indexesOutOfBounds(-1, 0, CROSSWORD_GRID_SIZE) === true);
            assert(CrosswordVerifier.indexesOutOfBounds(0, -1, CROSSWORD_GRID_SIZE) === true);
        });

        it('should return true when i or j is greater than or equal to CROSSWORD_GRID_SIZE', () => {
            assert(CrosswordVerifier.indexesOutOfBounds(0, CROSSWORD_GRID_SIZE, CROSSWORD_GRID_SIZE) === true);
            assert(CrosswordVerifier.indexesOutOfBounds(CROSSWORD_GRID_SIZE, 0, CROSSWORD_GRID_SIZE) === true);
            assert(CrosswordVerifier.indexesOutOfBounds(CROSSWORD_GRID_SIZE, CROSSWORD_GRID_SIZE, CROSSWORD_GRID_SIZE) === true);
        });

        it('should return false when i is between 0 and 9', () => {
            assert(CrosswordVerifier.indexesOutOfBounds(0, 0, CROSSWORD_GRID_SIZE) === false);
            assert(CrosswordVerifier.indexesOutOfBounds(4, 4, CROSSWORD_GRID_SIZE) === false);
            assert(CrosswordVerifier.indexesOutOfBounds(9, 9, CROSSWORD_GRID_SIZE) === false);
        });
    });

    describe('verify()', () => {
        it('should check that a blank grid is valid', () => {
            assert(CrosswordVerifier.verify(crosswordGenerator) === true);
        });
    });
});
