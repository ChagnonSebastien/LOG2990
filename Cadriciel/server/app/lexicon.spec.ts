import { expect } from 'chai';
import { Lexicon } from './lexicon';
import * as path from 'path';

describe('Lexicon', () => {
    let lexicon: Lexicon;

    beforeEach(() => {
        const jsonPath = path.join(__dirname, '..', 'app', 'words.json');
        lexicon = new Lexicon(jsonPath);
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

    describe('wordsOfLengthUpTo(length: number, common: boolean): Array<string> { }', () => {
        it('should get all the common words of length 3 and only 3', () => {
            const commonality = true;
            const words = lexicon.wordsOfLengthUpTo(3, commonality);
            const lengths = Array.from(new Set(words.map(value => value.length)));
            expect(lengths[0]).to.equal(3);
            expect(lengths.length).to.equal(1);
            expect(lexicon.wordsOfLength(3, commonality).length).to.equal(words.length);
        });

        it('should get all the uncommon words of length 3 and only 3', () => {
            const commonality = false;
            const words = lexicon.wordsOfLengthUpTo(3, commonality);
            const lengths = Array.from(new Set(words.map(value => value.length)));
            expect(lengths[0]).to.equal(3);
            expect(lengths.length).to.equal(1);
            expect(lexicon.wordsOfLength(3, commonality).length).to.equal(words.length);
        });

        it('should get all common words of same length and shorter', () => {
            const commonality = true;
            const words = lexicon.wordsOfLengthUpTo(6, commonality);
            const wordLengths = words.map(value => value.length);
            const maxLength = wordLengths.reduce((previous, current) => {
                return previous > current ? previous : current;
            });
            expect(maxLength).to.equal(6);
            const minLength = wordLengths.reduce((previous, current) => {
                return previous < current ? previous : current;
            });
            expect(minLength).to.equal(3);
        });

        it('should get all uncommon words of same length and shorter', () => {
            const commonality = false;
            const words = lexicon.wordsOfLengthUpTo(6, commonality);
            const wordLengths = words.map(value => value.length);
            const maxLength = wordLengths.reduce((previous, current) => {
                return previous > current ? previous : current;
            });
            expect(maxLength).to.equal(6);
            const minLength = wordLengths.reduce((previous, current) => {
                return previous < current ? previous : current;
            });
            expect(minLength).to.equal(3);
        });
    });

    describe('allWordsOfLengthUpTo(length: number): Array<string> { }', () => {
        it('should get all the words of length 3 and only 3', () => {
            const words = lexicon.allWordsOfLengthUpTo(3);
            const lengths = Array.from(new Set(words.map(value => value.length)));
            expect(lengths[0]).to.equal(3);
            expect(lengths.length).to.equal(1);
        });

        it('should get all the words of same length and shorter', () => {
            const words = lexicon.allWordsOfLengthUpTo(6);
            const maxLength = words.map(value => value.length)
                .reduce((previous, current) => {
                    return previous > current ? previous : current;
                });
            expect(maxLength).to.equal(6);
        });
    });

    describe('wordsMatching()', () => {
        it('should get all the common words matching "h   o"', () => {
            const wordsThatMatch: Array<string> = lexicon.wordsMatching('h   o', true);
            expect(wordsThatMatch.includes('hello')).to.be.true;
            expect(wordsThatMatch.includes('hydro')).to.be.false;
            expect(wordsThatMatch.includes('hullo')).to.be.false;
            expect(wordsThatMatch.includes('hallo')).to.be.false;
            expect(wordsThatMatch.includes('hollo')).to.be.false;
            expect(wordsThatMatch.includes('hippo')).to.be.false;
        });

        it('should get all the uncommon words matching "h   o"', () => {
            const wordsThatMatch: Array<string> = lexicon.wordsMatching('h   o', false);
            expect(wordsThatMatch.includes('hello')).to.be.false;
            expect(wordsThatMatch.includes('hydro')).to.be.true;
            expect(wordsThatMatch.includes('hullo')).to.be.true;
            expect(wordsThatMatch.includes('hallo')).to.be.true;
            expect(wordsThatMatch.includes('hollo')).to.be.true;
            expect(wordsThatMatch.includes('hippo')).to.be.true;
        });
    });

    describe('allWordsMatching()', () => {
        it('should get all the words matching "h   o"', () => {
            const wordsThatMatch: Array<string> = lexicon.allWordsMatching('h   o');
            expect(wordsThatMatch.includes('hello')).to.be.true;
            expect(wordsThatMatch.includes('hydro')).to.be.true;
            expect(wordsThatMatch.includes('hullo')).to.be.true;
            expect(wordsThatMatch.includes('hallo')).to.be.true;
            expect(wordsThatMatch.includes('hollo')).to.be.true;
            expect(wordsThatMatch.includes('hippo')).to.be.true;
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
        it('should only match common words with h and/or o when the pattern is "h   o     "', () => {
            const words = lexicon.wordsForPattern('h   o     ', true);
            expect(words.includes('hello')).to.be.true;
            expect(words.includes('hydro')).to.be.false;
            expect(words.includes('cello')).to.be.false;
            expect(words.includes('organ')).to.be.true;
            expect(words.includes('boring')).to.be.true;
            expect(words.includes('codeine')).to.be.false;
        });

        it('should only match uncommon words with h and/or o when the pattern is "h   o     "', () => {
            const words = lexicon.wordsForPattern('h   o     ', false);
            expect(words.includes('hello')).to.be.false;
            expect(words.includes('hydro')).to.be.true;
            expect(words.includes('cello')).to.be.false;
            expect(words.includes('organ')).to.be.false;
            expect(words.includes('boring')).to.be.false;
            expect(words.includes('codeine')).to.be.true;
        });
    });

    describe('allWordsForPattern(pattern: string): string[] { }', () => {
        it('should only match words with h and/or o when the pattern is "h   o     "', () => {
            const words = lexicon.allWordsForPattern('h   o     ');
            expect(words.includes('hello')).to.be.true;
            expect(words.includes('hydro')).to.be.true;
            expect(words.includes('cello')).to.be.false;
            expect(words.includes('organ')).to.be.true;
            expect(words.includes('boring')).to.be.true;
            expect(words.includes('codeine')).to.be.true;
        });
    });

    describe('wordsForNonEmptyPattern(pattern: string): string[] { }', () => {
        it('should return only common words that fit the subpatterns of the pattern', () => {
            const words: string[] = lexicon.wordsForNonEmptyPattern('h   o', true);
            expect(words.includes('hydro')).to.be.false;
            expect(words.includes('hello')).to.be.true;
            expect(words.includes('cello')).to.be.false;
            expect(words.includes('eat')).to.be.false;
            expect(words.includes('ham')).to.be.true;
        });

        it('should return only uncommon words that fit the subpatterns of the pattern', () => {
            const words: string[] = lexicon.wordsForNonEmptyPattern('h   o', false);
            expect(words.includes('hydro')).to.be.true;
            expect(words.includes('hello')).to.be.false;
            expect(words.includes('cello')).to.be.false;
            expect(words.includes('eat')).to.be.false;
            expect(words.includes('ham')).to.be.false;
        });

        it('should not return anything if the pattern provided is blank', () => {
            const words: string[] = lexicon.wordsForNonEmptyPattern('     ', true)
                .concat(lexicon.wordsForNonEmptyPattern('     ', false));
            expect(words.length).to.equal(0);
        });
    });

    describe('allWordsForNonEmptyPattern(pattern: string): string[] { }', () => {
        it('should return all words that fit the subpatterns of the pattern', () => {
            const words: string[] = lexicon.allWordsForNonEmptyPattern('h   o');
            expect(words.includes('hello')).to.be.true;
            expect(words.includes('cello')).to.be.false;
            expect(words.includes('eat')).to.be.false;
            expect(words.includes('ham')).to.be.true;
        });

        it('should not return anything if the pattern provided is blank', () => {
            const words: string[] = lexicon.allWordsForNonEmptyPattern('     ');
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
