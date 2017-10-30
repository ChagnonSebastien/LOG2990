import { CrosswordSquare } from './crossword-square';

describe('#CrosswordSquare', () => {
    it('should construct', () => {
        const square = new CrosswordSquare(' ');
        expect(square).toBeDefined();
    });
});
