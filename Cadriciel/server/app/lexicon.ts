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
        return this.wordsOfLength(length, true)
            .concat(this.wordsOfLength(length, false));
    }

    public wordsOfLengthUpTo(length: number, common: boolean): Array<string> {
        return new Array(length - 2).fill(null)
            .map((value, index) => {
                return this.wordsOfLength(index + 3, common);
            }).reduce((previous, current) => {
                return previous.concat(current);
            });
    }

    public allWordsOfLengthUpTo(length: number): Array<string> {
        return this.wordsOfLengthUpTo(length, true)
            .concat(this.wordsOfLengthUpTo(length, false));
    }

    public wordsMatching(pattern: string, common: boolean): Array<string> {
        const patternRegex = this.patternToRegex(pattern);
        return this.wordsOfLength(pattern.length, common)
            .filter(word => patternRegex.test(word));
    }

    public allWordsMatching(pattern: string): Array<string> {
        return this.wordsMatching(pattern, true)
            .concat(this.wordsMatching(pattern, false));
    }

    public subpatterns(pattern: string): string[] {
        const results: Set<string> = new Set<string>();
        for (let length = 3; length <= pattern.length; length++) {
            for (let index = 0; index <= pattern.length - length; index++) {
                results.add(pattern.substr(index, length));
            }
        }
        return Array.from(results);
    }

    public allWordsForPattern(pattern: string) {
        const isBlankPattern: boolean = pattern.trim().length === 0;
        if (isBlankPattern) {
            return this.allWordsOfLengthUpTo(pattern.length);
        } else {
            return this.wordsForNonEmptyPattern(pattern);
        }
    }

    public wordsForNonEmptyPattern(pattern: string): string[] {
        if (pattern.trim().length === 0) {
            return new Array<string>();
        }

        const subpatterns: string[] = this.subpatterns(pattern);
        const nonEmptySubpatterns = subpatterns.filter(subpattern => {
            const isNotEmpty: boolean = subpattern.trim().length > 0;
            return isNotEmpty;
        });
        const wordsForPattern = nonEmptySubpatterns.map(subpattern => {
            return this.allWordsMatching(subpattern);
        }).reduce((previous, current) => {
            return previous.concat(current);
        });

        return Array.from(new Set(wordsForPattern));
    }

    public randomWordFromArray(words: string[]): string {
        return words[Math.floor(Math.random() * words.length)];
    }
}
