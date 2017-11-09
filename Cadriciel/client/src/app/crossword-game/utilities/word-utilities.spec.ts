import { WordUtilities } from './word-utilities';

const grid = [
    ['a', 'p', 'p', 'e', 'a', 'l', '#', 'r', 'a', 't'],
    ['#', ' ', ' ', '#', ' ', ' ', ' ', 'i', ' ', 'e'],
    ['s', '#', 'a', 'p', 'p', 'e', 'n', 'd', 'i', 'x'],
    ['t', ' ', ' ', 'r', ' ', ' ', '#', 'e', ' ', 't'],
    ['a', '#', 'w', 'a', 'r', '#', 'p', '#', ' ', 'b'],
    ['f', ' ', ' ', 'c', '#', 'r', 'a', 'd', 'i', 'o'],
    ['f', 'i', 's', 't', '#', ' ', 's', ' ', ' ', 'o'],
    ['#', ' ', ' ', 'i', ' ', ' ', '#', ' ', ' ', 'k'],
    ['f', 'l', 'i', 'c', 'k', '#', ' ', ' ', ' ', '#'],
    [' ', ' ', ' ', 'e', ' ', ' ', ' ', ' ', ' ', ' ']
];

const wordsWithIndex = [
    { 'i': 0, 'j': 0, 'word': 'appeal', 'horizontal': true },
    { 'i': 0, 'j': 9, 'word': 'textbook', 'horizontal': false },
    { 'i': 2, 'j': 2, 'word': 'appendix', 'horizontal': true },
    { 'i': 0, 'j': 7, 'word': 'ride', 'horizontal': false },
    { 'i': 0, 'j': 7, 'word': 'rat', 'horizontal': true },
    { 'i': 5, 'j': 5, 'word': 'radio', 'horizontal': true },
    { 'i': 4, 'j': 6, 'word': 'pas', 'horizontal': false },
    { 'i': 2, 'j': 3, 'word': 'practice', 'horizontal': false },
    { 'i': 4, 'j': 2, 'word': 'war', 'horizontal': true },
    { 'i': 6, 'j': 0, 'word': 'fist', 'horizontal': true },
    { 'i': 8, 'j': 0, 'word': 'flick', 'horizontal': true },
    { 'i': 2, 'j': 0, 'word': 'staff', 'horizontal': false }
];

describe('#WordUtilities', () => {
    describe('forEachLetter()', () => {
        it('should execute the callback for each letter', () => {
            const appeal = wordsWithIndex[0];
            let result = '';
            WordUtilities.forEachLetter(appeal, (i, j) => {
                result += grid[i][j];
            });
            expect(appeal.word).toEqual(result);
        });
    });

    describe('endOfWord()', () => {
        it('should return true when the coordinates point to the end of the word', () => {
            const appeal = wordsWithIndex[0];
            expect(WordUtilities.endOfWord(appeal, 0, 5)).toBeTruthy();

            const textbook = wordsWithIndex[1];
            expect(WordUtilities.endOfWord(textbook, 7, 9)).toBeTruthy();
        });

        it('should return false when the coordinates do not point to the end of the word', () => {
            const appeal = wordsWithIndex[0];
            expect(WordUtilities.endOfWord(appeal, 0, 4)).toBeFalsy();

            const textbook = wordsWithIndex[1];
            expect(WordUtilities.endOfWord(textbook, 0, 0)).toBeFalsy();
        });
    });

    describe('beginningOfWord()', () => {
        it('should return true when the coordinates point to the beginning of the word', () => {
            const appeal = wordsWithIndex[0];
            expect(WordUtilities.beginningOfWord(appeal, 0, 0)).toBeTruthy();
        });

        it('should return false when the coordinates do not point to the beginning of the word', () => {
            const appeal = wordsWithIndex[0];
            expect(WordUtilities.beginningOfWord(appeal, 0, 1)).toBeFalsy();
        });
    });
});
