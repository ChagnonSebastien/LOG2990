import { CrosswordGenerator } from './crossword-generator';

export module CrosswordService {
    export function indexesOutOfBounds(i: number, j: number, size: number): boolean {
        return indexOutOfBounds(i, size) || indexOutOfBounds(j, size);
    }

    function indexOutOfBounds(i: number, size: number): boolean {
        return i < 0 || i >= size;
    }

    export function verify(crossword: CrosswordGenerator): boolean {
        const words = Array.from(crossword.words);
        if (words.length === 0) {
            return true;
        }
        const parsedWords = getAllWords(crossword);
        if (parsedWords.size !== words.length) {
            return false;
        }
        return words.map((word) => {
            return parsedWords.has(word);
        }).reduce((prev, cur) => {
            return prev && cur;
        });
    }

    function getWords(crossword: CrosswordGenerator, horizontal: boolean): Set<string> {
        const separators = [' ', '#'];
        // Extracts words from grid by joining the squares, then splitting
        return new Set(crossword.grid.map((line, index) => {
            return crossword.patternForLine(index, horizontal)
                .split(new RegExp(separators.join('|'), 'g'))
                .filter((value) => {
                    return value.length > 1;
                });
        }).reduce((prev, cur) => {
            return prev.concat(cur);
        }));
    }

    function getAllWords(crossword: CrosswordGenerator): Set<string> {
        return new Set([...getWords(crossword, true), ...getWords(crossword, false)]);
    }
}
