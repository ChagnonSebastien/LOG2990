import { assert, expect } from 'chai';
import { Crossword } from './crossword';

describe('Crossword', () => {
    let crossword: Crossword;
    beforeEach(() => {
        crossword = new Crossword(10);
    });

    it('The grid should be size 10 x 10', () => {
        expect(crossword.grid.length).to.equal(10);
        expect(crossword.grid[0].length).to.equal(10);
    });
});
