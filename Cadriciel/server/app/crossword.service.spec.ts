import { expect } from 'chai';
import { CrosswordService } from './crossword.service';
import { CrosswordGenerator } from './crossword';

describe('CrosswordChecker', () => {
    let crosswordGenerator: CrosswordGenerator;
    beforeEach(() => {
        crosswordGenerator = new CrosswordGenerator(10);
    });

    describe('verify()', () => {
        it('should check that a blank grid is valid', () => {
            expect(CrosswordService.verify(crosswordGenerator)).to.be.true;
        });
    });
});
