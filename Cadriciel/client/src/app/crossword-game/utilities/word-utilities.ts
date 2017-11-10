import { Word } from '../../../../../commun/word';

export module WordUtilities {
    export function forEachLetter(word: Word, callback) {
        for (let k = 0; k < word.word.length; k++) {
            const i = word.horizontal ? word.i : word.i + k;
            const j = word.horizontal ? word.j + k : word.j;
            callback(i, j);
        }
    }

    export function endOfWord(wordWithIndex: Word, i: number, j: number): boolean {
        if (wordWithIndex.horizontal) {
            return wordWithIndex.j + wordWithIndex.word.length - 1 === j;
        } else {
            return wordWithIndex.i + wordWithIndex.word.length - 1 === i;
        }
    }

    export function beginningOfWord(wordWithIndex: Word, i: number, j: number): boolean {
        return wordWithIndex.i === i && wordWithIndex.j === j;
    }
}
