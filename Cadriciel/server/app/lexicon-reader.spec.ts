import { assert, expect } from 'chai';
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
        const words: string[] = lexiconReader.readWords(lexiconFilePath);
        const wordsOfLength: string[] = lexiconReader.readWordsOfLength(words, 0);

        assert(wordsOfLength.length === 0);
    });

    it('Should return no words for words of length of 100', () => {
        const words: string[] = lexiconReader.readWords(lexiconFilePath);
        const wordsOfLength: string[] = lexiconReader.readWordsOfLength(words, 100);

        assert(wordsOfLength.length === 0);
    });

    it('Should return a string containing words when length is 5', () => {
        const words: string[] = lexiconReader.readWords(lexiconFilePath);
        const wordsOfLength: string[] = lexiconReader.readWordsOfLength(words, 5);

        assert(wordsOfLength.length !== 0);
    });

    // getWordsWithChar

    it('Should return empty array when searching for words with a at position 100', () => {
        const words: string[] = lexiconReader.readWords(lexiconFilePath);
        const wordsWithChar: string[] = lexiconReader.getWordsWithChar(words, 'a', 100);

        assert(wordsWithChar.length === 0);
    });

    it('Should return an array of words with a at position 0', () => {
        const words: string[] = lexiconReader.readWords(lexiconFilePath);
        const wordsWithChar: string[] = lexiconReader.getWordsWithChar(words, 'a', 0);

        assert(wordsWithChar[0][0] === 'a');
    });

    // getWordsMatchingPattern

    it('Should not return words when searching this pattern: empty string', () => {
        const words: string[] = lexiconReader.readWords(lexiconFilePath);
        const wordsMatchingPattern: string[] = lexiconReader.getWordsMatchingPattern(words, '');

        assert(wordsMatchingPattern.length === 0);
    });

    it(`Should return all words of 5 letters when searching this pattern: '     ' (5 spaces)`, () => {
        const words: string[] = lexiconReader.readWords(lexiconFilePath);
        const wordsMatchingPattern: string[] = lexiconReader.getWordsMatchingPattern(words, '     ');

        assert(wordsMatchingPattern[0].length === 5);
    });

    it(`Should return words of four letters, starting with a and finishing with e when searching this pattern: 'a  e'`, () => {
        const words: string[] = lexiconReader.readWords(lexiconFilePath);
        const wordsMatchingPattern: string[] = lexiconReader.getWordsMatchingPattern(words, 'a  e');

        assert(wordsMatchingPattern[0][0] === 'a' && wordsMatchingPattern[0][3] === 'e');
    });

    it('Should return words of five letters with an e at index 2 and an e at index 5', () => {
        const words: string[] = lexiconReader.readWords(lexiconFilePath);
        const wordsMatchingPattern: string[] = lexiconReader.getWordsMatchingPattern(words, '  e  e');

        assert(wordsMatchingPattern[0][2] === 'e' && wordsMatchingPattern[0][5] === 'e');
    });

    it('Should return 8 as the frequency of the word cat.', () => {
        const randomWord = 'cat';
        return lexiconReader.getWordFrequency(randomWord).then(function(data) {
            expect(data).to.equal(8);
        });
    });

    it('Should return the list of some uncommonwords in the lexicon', (done) => {
        const words: string[] = lexiconReader.readWords(lexiconFilePath);
        lexiconReader.getUncommonWords(words).then(function(data) {
            expect(data.length).to.be.greaterThan(0);
            done();
        });
    }).timeout(15000);

    it('Should return the list of some commonwords in the lexicon', (done) => {
        const words: string[] = lexiconReader.readWords(lexiconFilePath);
        lexiconReader.getCommonWords(words).then(function(data) {
            expect(data.length).to.be.greaterThan(0);
            done();
        });
    }).timeout(15000);

    it('Should return all the definitions of the word aalii', (done) => {
        lexiconReader.getWordDefinitions('aalii').then(function(data) {
            expect(data.length).to.be.greaterThan(0);
            done();
        });
    });

});
