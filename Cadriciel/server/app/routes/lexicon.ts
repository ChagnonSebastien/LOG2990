import * as express from 'express';
import * as request from 'request';
import { LexiconReader } from '../lexicon-reader';

module Route {

    export class Lexicon {

        public wordDefinition(req: express.Request, res: express.Response, next: express.NextFunction) {
            let uri = 'http://api.wordnik.com:80/v4/word.json';
            let options = 'definitions?limit=1&includeRelated=true&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
            let word = req.params.word;
            request(`${uri}/${word}/${options}`, (error, response, body) => {
                if (body == "[]") {
                    res.send("Invalid word");
                } else {
                    body = JSON.parse(body);
                    res.send(JSON.stringify(body[0].text));
                }
            })
        }

        public englishWordLexicon(req: express.Request, res: express.Response, next: express.NextFunction) {
            let lexiconReader = new LexiconReader();
            let lexicon: string[] = [];
            let lexiconFilePath: string = '../server/lexicon/englishWords.txt';
            lexicon = lexiconReader.readWords(lexiconFilePath);
            res.send(lexicon);
        }

        public getWordsOfLength(req: express.Request, res: express.Response, next: express.NextFunction) {
            let wordLength = req.params.wordLength;
            let lexiconReader = new LexiconReader();
            let lexiconFilePath: string = '../server/lexicon/englishWords.txt';
            let wordsOfLength:string[] = lexiconReader.readWordsOfLength(lexiconFilePath, wordLength);
            res.send(wordsOfLength);
        }

        public getWordsWithCharAt(req: express.Request, res: express.Response, next: express.NextFunction) {
            let charWanted = req.params.char;
            let position = Number(req.params.position);
            let lexiconReader = new LexiconReader();
            let lexiconFilePath: string = '../server/lexicon/englishWords.txt';
            let wordsWithChar = lexiconReader.getWordsWithChar(lexiconFilePath, charWanted, position);
            res.send(wordsWithChar);
        }

        public getWordsMatchingPattern(req: express.Request, res: express.Response, next: express.NextFunction) {
            let pattern = req.params.word;
            let lexiconReader = new LexiconReader();
            let lexiconFilePath: string = '../server/lexicon/englishWords.txt';
            let wordsWithChar = lexiconReader.getWordsMatchingPattern(lexiconFilePath, pattern);
            res.send(wordsWithChar);
        }


        public getUncommonWords(req: express.Request, res: express.Response, next: express.NextFunction) {
            let uri = 'http://api.wordnik.com:80/v4/word.json';
            let options = 'frequency?useCanonical=false&startYear=2012&endYear=2012&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
            let lexiconFilePath: string = '../server/lexicon/englishWords.txt';
            let lexiconReader = new LexiconReader();
            let lexicon: string[] = lexiconReader.readWords(lexiconFilePath);
            let numberOfWords: number = lexicon.length;
            let numberOfRequests: number = 20;
            let uncommonWordsMaxFrequency = 2
            let uncommonWords: string[] = [];


            for(let y = 0; y < numberOfRequests; y++) {
                let i:number = Math.floor(Math.random() * numberOfWords);
                request(`${uri}/${lexicon[i]}/${options}`, (error, response, body) => {
                    body = JSON.parse(body);
                    if(body.totalCount <= uncommonWordsMaxFrequency ){
                        uncommonWords.push(lexicon[i]);
                    }
                    if(y == 1) {
                        res.send(uncommonWords);
                    }
                });
            }
        }

        public getCommonWords(req: express.Request, res: express.Response, next: express.NextFunction) {
            let uri = 'http://api.wordnik.com:80/v4/word.json';
            let options = 'frequency?useCanonical=false&startYear=2012&endYear=2012&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
            let lexiconFilePath: string = '../server/lexicon/englishWords.txt';
            let lexiconReader = new LexiconReader();
            let lexicon: string[] = lexiconReader.readWords(lexiconFilePath);
            let numberOfWords: number = lexicon.length;
            let numberOfRequests: number = 20;
            let commonWordsMinFrequency = 1;
            let commonWords: string[] = [];


            for(let y = 0; y < numberOfRequests; y++) {
                let i:number = Math.floor(Math.random() * numberOfWords);
                request(`${uri}/${lexicon[i]}/${options}`, (error, response, body) => {
                    body = JSON.parse(body);
                    if(body.totalCount > commonWordsMinFrequency ){
                        commonWords.push(lexicon[i]);
                    }
                    if(y == 1 || commonWords.length >= 2) {
                        res.send(commonWords);
                    }
                });
            }
        }

        public getWordFrequency(req: express.Request, res: express.Response, next: express.NextFunction) {
            let uri = 'http://api.wordnik.com:80/v4/word.json';
            let options = 'frequency?useCanonical=false&startYear=2012&endYear=2012&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
            let lexiconFilePath: string = '../server/lexicon/englishWords.txt';
            let word = req.params.word;

            request(`${uri}/${word}/${options}`, (error, response, body) => {
                body = JSON.parse(body);
                res.send(JSON.stringify(body.totalCount));
            });
            
        }  
    }
}

export = Route;