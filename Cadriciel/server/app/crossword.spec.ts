import { expect } from 'chai';
import { CrosswordGenerator } from './crossword';

const size = 10;
function randomIndex(): number {
    return Math.floor(Math.random() * size);
}

describe('CrosswordGenerator', () => {
    let crossword: CrosswordGenerator;

    beforeEach(() => {
        crossword = new CrosswordGenerator(size);
    });

    describe('newGrid(size: number, fill: any) : Array<any> { }', () => {
        it('should return a grid with size 10 x 10', () => {
            expect(crossword.grid.length).to.equal(10);
            expect(crossword.grid[0].length).to.equal(10);
        });

        it('should return a grid with empty characters', () => {
            expect(crossword.grid[randomIndex()][randomIndex()]).to.equal(' ');
        });
    });

    describe('loadLexicon(file: string)', () => {
        it('should load the lexicon', () => {
            expect(crossword.lexicon.lexiconByLength['common']['3'].length).to.be.greaterThan(0);
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

        it('should not add a letter if it is not a single character', () => {
            expect(crossword.addLetter(0, 0, '')).to.be.false;
            expect(crossword.addLetter(0, 0, 'ab')).to.be.false;
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

    describe('addBlackSquares(i: number, j: number, word: string, horizontal: boolean): boolean { }', () => {
        it('should add a black square after the word', () => {
            expect(crossword.addBlackSquares(0, 0, 'hello', true)).to.be.true;
            expect(crossword.grid[0][5]).to.equal('#');
        });

        it('should add a black square before the word', () => {
            expect(crossword.addBlackSquares(0, 1, 'hello', true)).to.be.true;
            expect(crossword.grid[0][0]).to.equal('#');
        });

        it('should add a black square before and after the word', () => {
            expect(crossword.addBlackSquares(0, 1, 'hello', true)).to.be.true;
            expect(crossword.grid[0][0]).to.equal('#');
            expect(crossword.grid[0][6]).to.equal('#');
        })

        it('should fail to add a black square if another word is using the square', () => {
            expect(crossword.addWord(0, 0, 'hello', true)).to.be.true;
            expect(crossword.addBlackSquares(1, 0, 'hello', false)).to.be.false;
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

        it('should not delete a letter if it is not a single character', () => {
            expect(crossword.deleteLetter(0, 0, '')).to.be.false;
            expect(crossword.deleteLetter(0, 0, 'ab')).to.be.false;
        });

        it('should not delete a letter unless no more words are using it', () => {
            expect(crossword.addWord(0, 0, 'hello', true)).to.be.true;
            expect(crossword.addWord(0, 0, 'hello', false)).to.be.true;
            expect(crossword.deleteLetter(0, 0, 'h')).to.be.true;
            expect(crossword.grid[0][0]).to.equal('h');
        });
    });

    describe('deleteWord(i: number, j: number, word: string, horizontal: boolean): boolean { }', () => {
        it('should delete a previously inserted word', () => {
            expect(crossword.addWord(0, 0, 'hello', true)).to.be.true;
            expect(crossword.deleteWord(0, 0, 'hello', true)).to.be.true;
            expect(crossword.grid[0][0]).to.equal(' ');
            expect(crossword.grid[0][2]).to.equal(' ');
            expect(crossword.grid[0][4]).to.equal(' ');
        });
    });

    describe('scoreWord(word: string, pattern: string) { }', () => {
        it('should give a score of 5 when matching hello to hello', () => {
            expect(crossword.scoreWord('hello', 'hello')).to.equal(5);
        });

        it('should give a score of 0 when the word is hello and the pattern is blank', () => {
            expect(crossword.scoreWord('hello', '     ')).to.equal(0);
        });
    });

    describe('bestInsertIndex(word: string, pattern: string): number { }', () => {
        it('should give an index of 3 when the word is hello and the pattern is "   h   o "', () => {
            expect(crossword.bestInsertIndex('hello', '   h   o  ')).to.equal(3);
        });
    });

    describe('patternForLine(i: number, horizontal: boolean) { }', () => {
        it('should return the pattern "#         " if horizontal on a blank grid', () => {
            expect(crossword.addWord(1, 0, 'hello', false)).to.be.true;
            expect(crossword.patternForLine(0, true)).to.equal('#' + ' '.repeat(size - 1));
        });

        it('should return the pattern "#         " if vertical on a blank grid', () => {
            expect(crossword.addWord(0, 1, 'hello', true)).to.be.true;
            expect(crossword.patternForLine(0, false)).to.equal('#' + ' '.repeat(size - 1));
        });
    });

    describe('addRandomWord(i: number, horizontal: boolean): boolean { }', () => {
        it('should add a random word horizontally', () => {
            expect(crossword.addRandomWord(0, true)).to.be.true;
            expect(crossword.grid[0][0]).to.not.equal(' ');
            expect(crossword.grid[0][1]).to.not.equal(' ');
        });

        it('should add a random word vertically', () => {
            expect(crossword.addRandomWord(0, false)).to.be.true;
            expect(crossword.grid[0][0]).to.not.equal(' ');
            expect(crossword.grid[1][0]).to.not.equal(' ');
        });
    });

    describe('generateCrossword() { }', () => {
        it('should generate a crossword', () => {
            crossword.generateCrossword('intermediate');
        });
    });

    describe('saveState() { }', () => {
        it('should make a copy of the current grid', () => {
            expect(crossword.addWord(0, 0, 'hello', true)).to.be.true;
            expect(crossword.saveState()).to.be.true;
            expect(crossword.grid[0][0])
                .to.equal(crossword.previousGridState[0][0]);
            expect(crossword.grid[0][2])
                .to.equal(crossword.previousGridState[0][2]);
            expect(crossword.grid[0][4])
                .to.equal(crossword.previousGridState[0][4]);
            const i = randomIndex();
            const j = randomIndex();
            expect(crossword.grid[i][j])
                .to.equal(crossword.previousGridState[i][j]);
        });

        it('should make a copy of the current gridCounter', () => {
            expect(crossword.addWord(0, 0, 'hello', true)).to.be.true;
            expect(crossword.saveState()).to.be.true;
            expect(crossword.gridCounter[0][0])
                .to.equal(crossword.previousGridCounter[0][0]);
            expect(crossword.gridCounter[0][2])
                .to.equal(crossword.previousGridCounter[0][2]);
            expect(crossword.gridCounter[0][4])
                .to.equal(crossword.previousGridCounter[0][4]);
            const i = randomIndex();
            const j = randomIndex();
            expect(crossword.gridCounter[i][j])
                .to.equal(crossword.previousGridCounter[i][j]);
        });

        it('should be a deep copy', () => {
            expect(crossword.saveState()).to.be.true;
            expect(crossword.grid)
                .to.not.equal(crossword.previousGridState);
        });
    });

    describe('rollback() { }', () => {
        it('should rollback grid to previous state', () => {
            expect(crossword.saveState()).to.be.true;
            expect(crossword.addLetter(0, 0, 'a')).to.be.true;
            expect(crossword.addLetter(0, 9, 'a')).to.be.true;
            expect(crossword.addLetter(9, 0, 'a')).to.be.true;
            expect(crossword.addLetter(9, 9, 'a')).to.be.true;
            expect(crossword.rollback()).to.be.true;
            expect(crossword.grid[0][0]).to.equal(' ');
            expect(crossword.grid[0][9]).to.equal(' ');
            expect(crossword.grid[9][0]).to.equal(' ');
            expect(crossword.grid[9][9]).to.equal(' ');
        });

        it('should rollback gridCounter to previous state', () => {
            expect(crossword.saveState()).to.be.true;
            expect(crossword.addLetter(0, 0, 'a')).to.be.true;
            expect(crossword.addLetter(0, 9, 'a')).to.be.true;
            expect(crossword.addLetter(9, 0, 'a')).to.be.true;
            expect(crossword.addLetter(9, 9, 'a')).to.be.true;
            expect(crossword.rollback()).to.be.true;
            expect(crossword.gridCounter[0][0]).to.equal(0);
            expect(crossword.gridCounter[0][9]).to.equal(0);
            expect(crossword.gridCounter[9][0]).to.equal(0);
            expect(crossword.gridCounter[9][9]).to.equal(0);
        });

        it('should be a deep copy', () => {
            expect(crossword.rollback()).to.be.true;
            expect(crossword.previousGridState)
                .to.not.equal(crossword.grid);
        });
    });
});
