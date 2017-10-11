import * as express from 'express';
import { LexiconReader } from '../lexicon-reader';

module Route {

    export class Lexicon {

        public async wordDefinitions(req: express.Request, res: express.Response, next: express.NextFunction) {
            const word = req.params.word;
            const lexiconReader = new LexiconReader();
            const definitions: string[] = await lexiconReader.getWordDefinitions(word);
            res.send(definitions);
        }

        public englishWordLexicon(req: express.Request, res: express.Response, next: express.NextFunction) {
            const lexiconReader = new LexiconReader();
            let lexicon: string[] = [];
            const lexiconFilePath = '../server/lexicon/englishWords.txt';
            lexicon = lexiconReader.readWords(lexiconFilePath);
            res.send(lexicon);
        }

        public getWordsOfLength(req: express.Request, res: express.Response, next: express.NextFunction) {
            const wordLength: number = +req.params.wordLength;
            const lexiconReader = new LexiconReader();
            const lexiconFilePath = '../server/lexicon/englishWords.txt';
            const words: string[] = lexiconReader.readWords(lexiconFilePath);
            const wordsOfLength: string[] = lexiconReader.readWordsOfLength(words, wordLength);
            res.send(wordsOfLength);
        }

        public getWordsWithCharAt(req: express.Request, res: express.Response, next: express.NextFunction) {
            const charWanted = req.params.char;
            const position = Number(req.params.position);
            const lexiconReader = new LexiconReader();
            const lexiconFilePath = '../server/lexicon/englishWords.txt';
            const words: string[] = lexiconReader.readWords(lexiconFilePath);
            const wordsWithChar = lexiconReader.getWordsWithChar(words, charWanted, position);
            res.send(wordsWithChar);
        }

        public getWordsMatchingPattern(req: express.Request, res: express.Response, next: express.NextFunction) {
            const pattern = req.params.word;
            const lexiconReader = new LexiconReader();
            const lexiconFilePath = '../server/lexicon/englishWords.txt';
            const words: string[] = lexiconReader.readWords(lexiconFilePath);
            const wordsWithChar = lexiconReader.getWordsMatchingPattern(words, pattern);
            res.send(wordsWithChar);
        }

        public async getUncommonWords(req: express.Request, res: express.Response, next: express.NextFunction) {
            const lexiconReader = new LexiconReader();
            const lexiconFilePath = '../server/lexicon/englishWords.txt';
            const words: string[] = lexiconReader.readWords(lexiconFilePath);

            const uncommonwords: string[] = await lexiconReader.getUncommonWords(words);
            res.send(uncommonwords);
        }

        public async getCommonWords(req: express.Request, res: express.Response, next: express.NextFunction) {
            const lexiconReader = new LexiconReader();
            const lexiconFilePath = '../server/lexicon/englishWords.txt';
            const words: string[] = lexiconReader.readWords(lexiconFilePath);

            const commonwords: string[] = await lexiconReader.getCommonWords(words);
            res.send(commonwords);
        }

        public async getWordFrequency(req: express.Request, res: express.Response, next: express.NextFunction) {
            const word = req.params.word;
            const lexiconReader = new LexiconReader();
            const frequency = await lexiconReader.getWordFrequency(word);
            res.send(frequency.toString());
        }
    }
}

export = Route;
