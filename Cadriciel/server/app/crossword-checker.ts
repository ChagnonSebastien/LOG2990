import { CrosswordGenerator } from './crossword';

export module CrosswordChecker {
    export function verify(crossword: CrosswordGenerator): boolean {
        return true;
    }

    export function getWords(crossword: CrosswordGenerator, horizontal: boolean): Set<string> {
        const separators = [' ', '#'];
        // Extracts words from grid by joining the squares, then splitting
        return new Set(crossword.grid.map((line, index) => {
            return crossword.patternForLine(index, true)
                .split(new RegExp(separators.join('|'), 'g'))
                .filter((value) => {
                    return value !== '';
                });
        }).reduce((prev, cur) => {
            return prev.concat(cur);
        }));
    }

    export function getAllWords(crossword: CrosswordGenerator): Set<string> {
        return new Set([...getWords(crossword, true), ...getWords(crossword, false)]);
    }
}
