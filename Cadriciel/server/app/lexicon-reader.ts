import * as fs from 'fs';
import * as request from 'request';
import * as async from 'async';

import { WORD_API, DEFINITIONS_OPTIONS, FREQUENCY_OPTIONS } from './config';

export class LexiconReader {

    public readWords(file: string): string[] {
        return fs.readFileSync(file, 'utf8').split('\r\n');
    }

    public readWordsOfLength(lexicon: string[], wordLength: number): string[] {
        return lexicon.filter((word) => {
            return wordLength === word.length;
        });
    }

    public getWordsWithChar(lexicon: string[], character: string, position: number) {
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

    public async getUncommonWords(lexicon: string[]): Promise<any> {
        const randomWords = Array(40).fill(null).map((value) => {
            const randomWord = lexicon[Math.floor(Math.random() * lexicon.length)];
            return randomWord;
        });
        return new Promise(
            (resolve) => {
                async.filter(randomWords, (word, callback) => {
                    this.getWordFrequency(word).then((frequency) => {
                        callback(null, frequency < 1);
                    });
                }, (err, results: string[]) => {
                    resolve(results);
                });
            });
    }

    public async getCommonWords(lexicon: string[]): Promise<any> {
        const randomWords = Array(40).fill(null).map((value) => {
            const randomWord = lexicon[Math.floor(Math.random() * lexicon.length)];
            return randomWord;
        });
        return new Promise(
            (resolve) => {
                async.filter(randomWords, (word, callback) => {
                    this.getWordFrequency(word).then((frequency) => {
                        callback(null, frequency >= 1);
                    });
                }, (err, results: string[]) => {
                    resolve(results);
                });
            });
    }

    public getWordFrequency(word: string): Promise<number> {
        return new Promise<number>(resolve => {
            request(`${WORD_API}/${word}/${FREQUENCY_OPTIONS}`, (error, response, body) => {
                body = JSON.parse(body);
                resolve(body.totalCount);
            });
        });
    }

    public getWordDefinitions(word: string): Promise<string[]> {
        let definitions: string[] = [];
        return new Promise<string[]>(resolve => {
            request(`${WORD_API}/${word}/${DEFINITIONS_OPTIONS}`, (error, response, body) => {
                body = JSON.parse(body);
                if (body === []) {
                    definitions = [];
                } else {
                    for (let i = 0; i < body.length; i++) {
                        definitions.push(body[i].text);
                    }
                }
                resolve(definitions);
            });
        });
    }
}




