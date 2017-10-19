import { expect } from 'chai';
import { Lexicon } from './lexicon';
import * as path from 'path';

describe('Lexicon', () => {
    let lexicon: Lexicon;

    beforeEach(() => {
        const jsonPath = path.join(__dirname, '..', 'app', 'words.json');
        lexicon = new Lexicon(jsonPath);
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
