import * as fs from 'fs';

export class Lexicon {
    public lexiconByLength: any;

    constructor(file: string) {
        this.parseLexiconByLength(file);
    }

    public parseLexiconByLength(file: string) {
        this.lexiconByLength = JSON.parse(fs.readFileSync(file, 'utf8'));
    }
}
