import { CrosswordSquare } from './crossword-square';

describe('#CrosswordSquare', () => {
    it('should construct', () => {
        const square = new CrosswordSquare(' ');
        expect(square).toBeDefined();
    });

    it('should not have an input greater than 1 character', () => {
        const square = new CrosswordSquare('hello');
        expect(square.answer.length).toEqual(1);
        expect(square.answer).toEqual('h');
    });

    describe('letterFound()', () => {
        it('should be false when the letter is not found', () => {
            const square = new CrosswordSquare('a');
            expect(square.letterFound()).toBeFalsy();
        });

        it('should be true when the letter is found', () => {
            const square = new CrosswordSquare('a');
            square.input = 'a';
            expect(square.letterFound()).toBeTruthy();
        });

        it('should be false when the square is black', () => {
            const squareHash = new CrosswordSquare('#');
            expect(squareHash.letterFound()).toBeFalsy();
            const squareBlank = new CrosswordSquare(' ');
            expect(squareBlank.letterFound()).toBeFalsy();
        });
    });
});
