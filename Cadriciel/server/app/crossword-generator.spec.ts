import { expect } from 'chai';
import { CrosswordGenerator } from './crossword-generator';

import { CROSSWORD_GRID_SIZE } from './config';

function randomIndex(): number {
    return Math.floor(Math.random() * CROSSWORD_GRID_SIZE);
}

describe('CrosswordGenerator', () => {
    let crossword: CrosswordGenerator;

    beforeEach(() => {
        crossword = new CrosswordGenerator(CROSSWORD_GRID_SIZE);
    });

    describe('constructor()', () => {
        it('should return a grid with size CROSSWORD_GRID_SIZE x CROSSWORD_GRID_SIZE', () => {
            expect(crossword.grid.length).to.equal(CROSSWORD_GRID_SIZE);
            expect(crossword.grid[0].length).to.equal(CROSSWORD_GRID_SIZE);
        });

        it('should return a grid with empty characters', () => {
            expect(crossword.grid[randomIndex()][randomIndex()]).to.equal(' ');
        });
    });

    describe('patternForLine()', () => {
        it('should return the pattern "          " if horizontal on a blank grid', () => {
            expect(crossword.patternForLine(0, true)).to.equal(' '.repeat(CROSSWORD_GRID_SIZE));
        });

        it('should return the pattern "          " if vertical on a blank grid', () => {
            expect(crossword.patternForLine(0, false)).to.equal(' '.repeat(CROSSWORD_GRID_SIZE));
        });
    });

    describe('newCrossword() { }', () => {
        it('should generate a new easy crossword', () => {
            crossword.newCrossword('easy');
            expect(crossword.words.size).to.be.greaterThan(0);
        }).timeout(15000);

        it('should generate a new normal crossword', () => {
            crossword.newCrossword('normal');
            expect(crossword.words.size).to.be.greaterThan(0);
        }).timeout(15000);

        it('should generate a new hard crossword', () => {
            crossword.newCrossword('hard');
            expect(crossword.words.size).to.be.greaterThan(0);
        }).timeout(15000);
    });

    describe('mutate()', () => {
        it('should mutate an easy crossword', () => {
            const difficulty = 'easy';

            // Generate an easy crossword
            crossword.newCrossword(difficulty);
            expect(crossword.words.size).to.be.greaterThan(0);

            // Choose 1 word out of 3 to be 'found'
            const foundWords = crossword.wordsWithIndex.filter(() => {
                return Math.floor(Math.random() * 3) === 0;
            });

            crossword.mutate(difficulty, foundWords);

            expect(crossword.words.size)
                .to.be.at.least(foundWords.length);

            // Check that all 'found' words are in the new crossword
            expect(foundWords.map((word) => {
                return crossword.words.has(word.word);
            }).reduce((prev, cur) => {
                return prev && cur;
            })).to.be.true;
        }).timeout(15000);

        it('should mutate a normal crossword', () => {
            const difficulty = 'normal';

            // Generate an easy crossword
            crossword.newCrossword(difficulty);
            expect(crossword.words.size).to.be.greaterThan(0);

            // Choose 1 word out of 3 to be 'found'
            const foundWords = crossword.wordsWithIndex.filter(() => {
                return Math.floor(Math.random() * 3) === 0;
            });

            crossword.mutate(difficulty, foundWords);

            expect(crossword.words.size)
                .to.be.at.least(foundWords.length);

            // Check that all 'found' words are in the new crossword
            expect(foundWords.map((word) => {
                return crossword.words.has(word.word);
            }).reduce((prev, cur) => {
                return prev && cur;
            })).to.be.true;
        }).timeout(15000);

        it('should mutate a hard crossword', () => {
            const difficulty = 'hard';

            // Generate an easy crossword
            crossword.newCrossword(difficulty);
            expect(crossword.words.size).to.be.greaterThan(0);

            // Choose 1 word out of 3 to be 'found'
            const foundWords = crossword.wordsWithIndex.filter(() => {
                return Math.floor(Math.random() * 3) === 0;
            });

            crossword.mutate(difficulty, foundWords);

            expect(crossword.words.size)
                .to.be.at.least(foundWords.length);

            // Check that all 'found' words are in the new crossword
            expect(foundWords.map((word) => {
                return crossword.words.has(word.word);
            }).reduce((prev, cur) => {
                return prev && cur;
            })).to.be.true;
        }).timeout(15000);
    });
});
