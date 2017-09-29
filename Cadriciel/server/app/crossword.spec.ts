import { expect } from 'chai';
import { Crossword } from './crossword';

const size = 10;
function randomIndex(): number {
    return Math.floor(Math.random() * size);
}

describe('Crossword', () => {
    let crossword: Crossword;

    beforeEach(() => {
        crossword = new Crossword(size);
    });

    describe('getEmptyGrid(size: number) : String[][] { }', () => {
        it('should return a grid with size 10 x 10', () => {
            expect(crossword.grid.length).to.equal(10);
            expect(crossword.grid[0].length).to.equal(10);
        });

        it('should return a grid with empty characters', () => {
            expect(crossword.grid[randomIndex()][randomIndex()]).to.equal(' ');
        });
    });

    describe('indexOutOfBounds(i: number): boolean { }', () => {
        it('should return true when i is smaller than 0', () => {
            expect(crossword.indexOutOfBounds(-1)).to.be.true;
        });

        it('should return true when i is greater than or equal to 10', () => {
            expect(crossword.indexOutOfBounds(10)).to.be.true;
        });

        it('should return false when i is between 0 and 9', () => {
            expect(crossword.indexOutOfBounds(0)).to.be.false;
            expect(crossword.indexOutOfBounds(4)).to.be.false;
            expect(crossword.indexOutOfBounds(9)).to.be.false;
        });
    });

    describe('indexesOutOfBounds(i: number, j: number): boolean { }', () => {
        it('should return true when i or j is greater than or equal to 10', () => {
            expect(crossword.indexesOutOfBounds(10, 0)).to.be.true;
            expect(crossword.indexesOutOfBounds(0, 10)).to.be.true;
        });

        it('should return false when i or j is between 0 and 9', () => {
            expect(crossword.indexesOutOfBounds(0, 9)).to.be.false;
            expect(crossword.indexesOutOfBounds(9, 0)).to.be.false;
        });

        it('should return true when i or j is smaller than 0', () => {
            expect(crossword.indexesOutOfBounds(-1, 0)).to.be.true;
            expect(crossword.indexesOutOfBounds(0, -1)).to.be.true;
        });
    });

    describe('addLetter(i: number, j: number, letter: string) { }', () => {
        it('should insert the letter "a" at coordinates (3, 0)', () => {
            expect(crossword.addLetter(3, 0, 'a')).to.be.true;
            expect(crossword.grid[3][0]).to.equal('a');
        });

        it('should not insert anything if the indexes are out of range', () => {
            expect(crossword.addLetter(10, 0, 'a')).to.be.false;
            expect(crossword.addLetter(0, 10, 'a')).to.be.false;
        });
    });

    describe('addWord(i: number, j: number, word: string, horizontal: boolean) { }', () => {
        it('should add the word hello horizontally from position (0, 0) to (0, 4)', () => {
            expect(crossword.addWord(0, 0, 'hello', true)).to.be.true;
            expect(crossword.grid[0][0]).to.equal('h');
            expect(crossword.grid[0][2]).to.equal('l');
            expect(crossword.grid[0][4]).to.equal('o');
        });

        it('should add the word hello vertically from position (0, 0) to (4, 0)', () => {
            expect(crossword.addWord(0, 0, 'hello', false)).to.be.true;
            expect(crossword.grid[0][0]).to.equal('h');
            expect(crossword.grid[2][0]).to.equal('l');
            expect(crossword.grid[4][0]).to.equal('o');
        });

        it('should allow overwriting when adding the same letter', () => {
            expect(crossword.addWord(0, 0, 'hello', false)).to.be.true;
            expect(crossword.addWord(0, 0, 'hello', true)).to.be.true;
        });

        it('should rollback when it fails to insert a word', () => {
            expect(crossword.addWord(0, 0, 'hello', true)).to.be.true;
            expect(crossword.addWord(0, 0, 'world', true)).to.be.false;
            expect(crossword.grid[0][0]).to.equal('h');
            expect(crossword.grid[0][2]).to.equal('l');
            expect(crossword.grid[0][4]).to.equal('o');
        });
    });

    describe('deleteLetter(i: number, j: number, letter: string): boolean { }', () => {
        it('should delete a letter at the specified position', () => {
            expect(crossword.addLetter(0, 0, 'h')).to.be.true;
            expect(crossword.deleteLetter(0, 0, 'h')).to.be.true;
        });

        it('should not delete a letter if the square is blank', () => {
            expect(crossword.deleteLetter(0, 0, 'h')).to.be.false;
        });
    });
});
