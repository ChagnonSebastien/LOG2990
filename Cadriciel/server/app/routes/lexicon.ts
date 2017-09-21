import * as express from 'express';
import * as request from 'request';
import { LexiconReader } from '../lexicon-reader';

module Route {

    export class Lexicon {

        public wordDefinition(req: express.Request, res: express.Response, next: express.NextFunction) {
            const uri = 'http://api.wordnik.com:80/v4/word.json';
            const options = 'definitions?limit=1&includeRelated=true&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
            const word = req.params.word;
            request(`${uri}/${word}/${options}`, (error, response, body) => {
                if (body === '[]') {
                    res.send('Invalid word');
                } else {
                    body = JSON.parse(body);
                    res.send(JSON.stringify(body[0].text));
                }
            });
        }

        public englishWordLexicon(req: express.Request, res: express.Response, next: express.NextFunction) {
            const lexiconReader = new LexiconReader();
            let lexicon: string[] = [];
            const lexiconFilePath = '../server/lexicon/englishWords.txt';
            lexicon = lexiconReader.readWords(lexiconFilePath);
            res.send(lexicon);
        }

        public getWordsOfLength(req: express.Request, res: express.Response, next: express.NextFunction) {
            const wordLength = req.params.wordLength;
            const lexiconReader = new LexiconReader();
            const lexiconFilePath = '../server/lexicon/englishWords.txt';
            const wordsOfLength: string[] = lexiconReader.readWordsOfLength(lexiconFilePath, wordLength);
            res.send(wordsOfLength);
        }

        public getWordsWithCharAt(req: express.Request, res: express.Response, next: express.NextFunction) {
            const charWanted = req.params.char;
            const position = Number(req.params.position);
            const lexiconReader = new LexiconReader();
            const lexiconFilePath = '../server/lexicon/englishWords.txt';
            const wordsWithChar = lexiconReader.getWordsWithChar(lexiconFilePath, charWanted, position);
            res.send(wordsWithChar);
        }

        public getWordsMatchingPattern(req: express.Request, res: express.Response, next: express.NextFunction) {
            const pattern = req.params.word;
            const lexiconReader = new LexiconReader();
            const lexiconFilePath = '../server/lexicon/englishWords.txt';
            const wordsWithChar = lexiconReader.getWordsMatchingPattern(lexiconFilePath, pattern);
            res.send(wordsWithChar);
        }


        public getUncommonWords(req: express.Request, res: express.Response, next: express.NextFunction) {
            const uri = 'http://api.wordnik.com:80/v4/word.json';
            const options = 'frequency?useCanonical=false&startYear=2012&endYear=2012&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
            const lexiconFilePath = '../server/lexicon/englishWords.txt';
            const lexiconReader = new LexiconReader();
            const lexicon: string[] = lexiconReader.readWords(lexiconFilePath);
            const numberOfWords: number = lexicon.length;
            const numberOfRequests = 20;
            const uncommonWordsMaxFrequency = 2;
            const uncommonWords: string[] = [];


            for (let y = 0; y < numberOfRequests; y++) {
                const i: number = Math.floor(Math.random() * numberOfWords);
                request(`${uri}/${lexicon[i]}/${options}`, (error, response, body) => {
                    body = JSON.parse(body);
                    if (body.totalCount <= uncommonWordsMaxFrequency) {
                        uncommonWords.push(lexicon[i]);
                    }
                    if (y === 1) {
                        res.send(uncommonWords);
                    }
                });
            }
        }

        public getCommonWords(req: express.Request, res: express.Response, next: express.NextFunction) {
            const uri = 'http://api.wordnik.com:80/v4/word.json';
            const options = 'frequency?useCanonical=false&startYear=2012&endYear=2012&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
            const lexiconFilePath = '../server/lexicon/englishWords.txt';
            const lexiconReader = new LexiconReader();
            const lexicon: string[] = lexiconReader.readWords(lexiconFilePath);
            const numberOfWords: number = lexicon.length;
            const numberOfRequests = 20;
            const commonWordsMinFrequency = 1;
            const commonWords: string[] = [];


            for (let y = 0; y < numberOfRequests; y++) {
                const i: number = Math.floor(Math.random() * numberOfWords);
                request(`${uri}/${lexicon[i]}/${options}`, (error, response, body) => {
                    body = JSON.parse(body);
                    if (body.totalCount > commonWordsMinFrequency) {
                        commonWords.push(lexicon[i]);
                    }
                    if (y === 1 || commonWords.length >= 2) {
                        res.send(commonWords);
                    }
                });
            }
        }

        public getWordFrequency(req: express.Request, res: express.Response, next: express.NextFunction) {
            const uri = 'http://api.wordnik.com:80/v4/word.json';
            const options = 'frequency?useCanonical=false&startYear=2012&endYear=2012&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
            const word = req.params.word;

            request(`${uri}/${word}/${options}`, (error, response, body) => {
                body = JSON.parse(body);
                res.send(JSON.stringify(body.totalCount));
            });

        }
    }
}

export = Route;
