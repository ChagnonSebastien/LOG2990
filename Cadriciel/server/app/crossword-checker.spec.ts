import { expect } from 'chai';
import { CrosswordChecker } from './crossword-checker';
import { CrosswordGenerator } from './crossword';

describe('CrosswordChecker', () => {
    const crosswordGenerator = new CrosswordGenerator(10);
    beforeEach(() => {
        crosswordGenerator.reset();
    });

    describe('verify()', () => {
        it('should check that a blank grid is valid', () => {
            expect(CrosswordChecker.verify(crosswordGenerator)).to.be.true;
        });

        it('should be invalid when two horizontal words are adjacent to each other', () => {
            expect(crosswordGenerator.addWord(0, 0, 'hello', true)).to.be.true;
            expect(crosswordGenerator.addWord(1, 0, 'hilton', true)).to.be.false;
            expect(CrosswordChecker.verify(crosswordGenerator)).to.be.true;
        });

        it('should return invalid when two vertical words are adjacent to each other', () => {
            expect(crosswordGenerator.addWord(0, 0, 'hello', false)).to.be.true;
            expect(crosswordGenerator.addWord(0, 1, 'hilton', false)).to.be.false;
            expect(CrosswordChecker.verify(crosswordGenerator)).to.be.true;
        });
    });
});
