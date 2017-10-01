import * as fs from 'fs';

export class Lexicon {
    public lexiconByLength: any;

    constructor(file: string) {
        this.parseLexiconByLength(file);
    }

    public parseLexiconByLength(file: string) {
        this.lexiconByLength = JSON.parse(fs.readFileSync(file, 'utf8'));
    }

    public patternToRegex(pattern: string): RegExp {
        const regex = /\s/g;
        const toMatch = pattern.replace(regex, '[a-z]');
        return new RegExp(toMatch, 'g');
    }

    public words(common: boolean): any {
        return this.lexiconByLength[common ? 'common' : 'uncommon'];
    }

    public wordsOfLength(length: number, common: boolean): Array<string> {
        return this.words(common)[length.toString()];
    }

    public allWordsOfLength(length: number): Array<string> {
        return this.wordsOfLength(length, true).concat(this.wordsOfLength(length, false));
    }

    public wordsMatching(pattern: string): Array<string> {
        const patternRegex = this.patternToRegex(pattern);
        return this.allWordsOfLength(pattern.length).filter(word => patternRegex.test(word));
    }
}
