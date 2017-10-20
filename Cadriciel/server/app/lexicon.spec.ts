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

    describe('randomWordFromArray(words: string[]): string { }', () => {
        it('should return a random word contained in the array provided', () => {
            const words: string[] = ['hello', 'world', 'walleandtomato', 'tomato'];
            expect(words.includes(lexicon.randomWordFromArray(words))).to.be.true;
        });
    });
});
