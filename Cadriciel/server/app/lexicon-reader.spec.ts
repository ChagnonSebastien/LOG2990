import { assert } from 'chai';
import { LexiconReader } from './lexicon-reader';

describe('LexiconReader', () => {
    const lexiconFilePath = '../server/lexicon/englishWords.txt';
    const lexiconReader: LexiconReader = new LexiconReader();

    // readWords method

    it('Should return the first word of the lexicon ', () => {
        const firstWord: string = lexiconReader.readWords(lexiconFilePath)[0];

        assert(firstWord === 'aalii');
    });

    it('Should return the last word of the lexicon ', () => {
        const words: string[] = lexiconReader.readWords(lexiconFilePath);
        const lastWord: string = words[words.length - 1];

        assert(lastWord === 'zymotic');
    });

    it('Should return the word in the middle of the lexicon ', () => {
        const words: string[] = lexiconReader.readWords(lexiconFilePath);
        const middleWord: string = words[words.length / 2];

        assert(middleWord === 'jocosity');
    });

    it('Should not return an empty array as the lexicon ', () => {
        const words: string[] = lexiconReader.readWords(lexiconFilePath);

        assert(words !== []);
    });

    // readWordsOfLength method

    it('Should return no words for words of length of 0', () => {
        const wordsOfLength: string[] = lexiconReader.readWordsOfLength(lexiconFilePath, 0);

        assert(wordsOfLength.length === 0);
    });

    it('Should return no words for words of length of 100', () => {
        const wordsOfLength: string[] = lexiconReader.readWordsOfLength(lexiconFilePath, 100);

        assert(wordsOfLength.length === 0);
    });

    it('Should return a string containing words when length is 5', () => {
        const wordsOfLength: string[] = lexiconReader.readWordsOfLength(lexiconFilePath, 5);

        assert(wordsOfLength.length !== 0);
    });

    // getWordsWithChar

    it('Should return empty array when searching for words with a at position 100', () => {
        const wordsWithChar: string[] = lexiconReader.getWordsWithChar(lexiconFilePath, 'a', 100);

        assert(wordsWithChar.length === 0);
    });

    it('Should return an array of words with a at position 0', () => {
        const wordsWithChar: string[] = lexiconReader.getWordsWithChar(lexiconFilePath, 'a', 0);

        assert(wordsWithChar[0][0] === 'a');
    });

    // getWordsMatchingPattern

    it('Should not return words when searching this pattern: empty string', () => {
        const wordsMatchingPattern: string[] = lexiconReader.getWordsMatchingPattern(lexiconFilePath, '');

        assert(wordsMatchingPattern.length === 0);
    });

    it(`Should return all words of 5 letters when searching this pattern: '     ' (5 spaces)`, () => {
        const wordsMatchingPattern: string[] = lexiconReader.getWordsMatchingPattern(lexiconFilePath, '     ');

        assert(wordsMatchingPattern[0].length === 5);
    });

    it(`Should return words of four letters, starting with a and finishing with e when searching this pattern: 'a  e'`, () => {
        const wordsMatchingPattern: string[] = lexiconReader.getWordsMatchingPattern(lexiconFilePath, 'a  e');

        assert(wordsMatchingPattern[0][0] === 'a' && wordsMatchingPattern[0][3] === 'e');
    });

    it('Should return words of five letters with an e at index 2 and an e at index 5', () => {
        const wordsMatchingPattern: string[] = lexiconReader.getWordsMatchingPattern(lexiconFilePath, '  e  e');

        assert(wordsMatchingPattern[0][2] === 'e' && wordsMatchingPattern[0][5] === 'e');
    });
});
