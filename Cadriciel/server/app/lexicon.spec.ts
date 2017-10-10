import { expect } from 'chai';
import { Lexicon } from './lexicon';
import * as path from 'path';

describe('Lexicon', () => {
    let lexicon: Lexicon;

    beforeEach(() => {
        const jsonPath = path.join(__dirname, '..', 'app', 'words.json');
        lexicon = new Lexicon(jsonPath);
    });

    describe('parseLexiconByLength()', () => {
        it('should get the Lexicon from the json file', () => {
            expect(lexicon.lexiconByLength['common']['14'][5]).to.equal('interpretation');
        });
    });

    describe('patternToRegex()', () => {
        it('"h   o" should match hello', () => {
            const helloRegex = lexicon.patternToRegex('h   o');
            expect(helloRegex.test('hello')).to.be.true;
        });
    });

    describe('words()', () => {
        it('should get common words', () => {
            expect(lexicon.words(true)['3'][0]).to.equal('ace');
        });

        it('should get uncommon words', () => {
            expect(lexicon.words(false)['3'][0]).to.equal('aba');
        });
    });

    describe('wordsOfLength()', () => {
        it('should get words of length 14', () => {
            const commonWords: Array<string> = lexicon.wordsOfLength(14, true);
            const randIndex = Math.floor(Math.random() * commonWords.length);
            expect(commonWords[randIndex].length).to.equal(14);

            const uncommonWords: Array<string> = lexicon.wordsOfLength(14, false);
            const randIndex2 = Math.floor(Math.random() * uncommonWords.length);
            expect(uncommonWords[randIndex2].length).to.equal(14);
        });
    });

    describe('allWordsOfLength()', () => {
        it('should get all words of length 14', () => {
            const allWords: Array<string> = lexicon.allWordsOfLength(14);
            const randIndex = Math.floor(Math.random() * allWords.length);
            expect(allWords[randIndex].length).to.equal(14);
        });
    });

    describe('wordsWithLengthUpTo(length: number): Array<string> { }', () => {
        it('should get all the words of length 3 and only 3', () => {
            const words = lexicon.wordsWithLengthUpTo(3);
            const lengths = Array.from(new Set(words.map(value => value.length)));
            expect(lengths[0]).to.equal(3);
            expect(lengths.length).to.equal(1);
        });

        it('should get all the words of same length and shorter', () => {
            const words = lexicon.wordsWithLengthUpTo(6);
            const maxLength = words.map(value => value.length)
                .reduce((previous, current) => {
                    return previous > current ? previous : current;
                });
            expect(maxLength).to.equal(6);
        });
    });

    describe('wordsMatching()', () => {
        it('should get all the words matching "h   o"', () => {
            const wordsThatMatch: Array<string> = lexicon.wordsMatching('h   o');
            expect(wordsThatMatch.includes('hello')).to.be.true;
            expect(wordsThatMatch.includes('hydro')).to.be.true;
            expect(wordsThatMatch.includes('hullo')).to.be.true;
            expect(wordsThatMatch.includes('hallo')).to.be.true;
            expect(wordsThatMatch.includes('hello')).to.be.true;
            expect(wordsThatMatch.includes('hello')).to.be.true;
        });
    });

    describe('subpatterns(pattern: string): string[] { }', () => {
        it('should return all the subpatterns of "h   o"', () => {
            const patterns = lexicon.subpatterns('h   o');
            expect(patterns.includes('h  ')).to.be.true;
            expect(patterns.includes('  o')).to.be.true;
            expect(patterns.includes('h   o')).to.be.true;
        });

        it('should not return any duplicate patterns', () => {
            const patterns = lexicon.subpatterns(' '.repeat(10));
            expect(patterns.length).to.equal(8);
        });
    });

    describe('wordsForPattern(pattern: string): string[] { }', () => {
        it('should only match words with h and/or o when the pattern is "h   o     "', () => {
            const words = lexicon.wordsForPattern('h   o     ');
            expect(words.includes('hello')).to.be.true;
            expect(words.includes('cello')).to.be.false;
            expect(words.includes('organ')).to.be.true;
            expect(words.includes('boring')).to.be.true;
        });
    });

    describe('wordsForNonEmptyPattern(pattern: string): string[] { }', () => {
        it('should return all words that fit the subpatterns of the pattern', () => {
            const words: string[] = lexicon.wordsForNonEmptyPattern('h   o');
            expect(words.includes('hello')).to.be.true;
            expect(words.includes('cello')).to.be.false;
            expect(words.includes('eat')).to.be.false;
            expect(words.includes('ham')).to.be.true;
        });

        it('should not return anything if the pattern provided is blank', () => {
            const words: string[] = lexicon.wordsForNonEmptyPattern('     ');
            expect(words.length).to.equal(0);
        });
    });

    describe('randomWordFromArray(words: string[]): string { }', () => {
        it('should return a random word contained in the array provided', () => {
            const words: string[] = ['hello', 'world', 'walleandtomato', 'tomato'];
            expect(words.includes(lexicon.randomWordFromArray(words))).to.be.true;
        });
    });
});