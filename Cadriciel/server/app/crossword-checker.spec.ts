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

    describe('getWords()', () => {
        it('should get all the words parsed from the crossword', () => {
            crosswordGenerator.generateCrossword('easy');
            const words = Array.from(crosswordGenerator.words);
            const parsedWords = CrosswordChecker.getWords(crosswordGenerator, true);
            expect(words.map((word) => {
                return parsedWords.has(word);
            }).reduce((prev, cur) => {
                return prev || cur;
            })).to.be.true;
        });
    });

    describe('getAllWords()', () => {
        
    });
});
