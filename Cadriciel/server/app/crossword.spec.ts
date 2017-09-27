import { expect } from 'chai';
import { Crossword } from './crossword';

describe('Crossword', () => {
    let crossword: Crossword;
    beforeEach(() => {
        crossword = new Crossword(10);
    });

    it('should be size 10 x 10', () => {
        expect(crossword.grid.length).to.equal(10);
        expect(crossword.grid[0].length).to.equal(10);
    });

    it('should insert the letter "a" at coordinates (3, 0)', () => {
        crossword.addLetter(3, 0, 'a');
        expect(crossword.grid[3][0]).to.equal('a');
    });
});
