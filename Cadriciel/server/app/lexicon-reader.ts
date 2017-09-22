import * as fs from 'fs';

export class LexiconReader {

    public readWords(file: string): string[] {
        let content: string[];
        content = fs.readFileSync(file, 'utf8').split('\r\n');
        return content;
    }

    public readWordsOfLength(lexicon: string[], wordLength: number): string[] {
        const wordsOfLength: string[] = [];

        for (const word of lexicon) {
            if (word.length == wordLength) {
                wordsOfLength.push(word);
            }
        }
        return wordsOfLength;
    }

    public getWordsWithChar(file: string, character: string, position: number) {
        const lexicon: string[] = this.readWords(file);
        const wordsWithChar: string[] = [];

        for (const word of lexicon) {
            if (position < word.length && word.charAt(position) === character) {
                wordsWithChar.push(word);
            }
        }

        return wordsWithChar;
    }

    public getWordsMatchingPattern(lexicon: string[], pattern: string) {
        const wordsWithChar: string[] = [];
        const wordsPatternLength: string[] = this.readWordsOfLength(lexicon, pattern.length);

        for (let i = 0; i < wordsPatternLength.length; i++) {
            let match = true;
            for (let j = 0; j < pattern.length; j++) {
                if (wordsPatternLength[i][j] !== pattern[j] && pattern[j] !== ' ') {
                    match = false;
                }
            }
            if (match) {
                wordsWithChar.push(wordsPatternLength[i]);
            }
        }

        return wordsWithChar;
    }
}




