import { expect } from 'chai';
import { Lexicon } from './lexicon';
import * as path from 'path';

describe('Lexicon', () => {
    let lexicon: Lexicon;

    beforeEach(() => {
        const jsonPath = path.join(__dirname, '..', 'app', 'words.json');
        lexicon = new Lexicon(jsonPath);
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
