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
});
