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
            let filepath: string = '../server/lexicon/englishWords.txt';
            
            lexicon = lexiconReader.readWords(filepath);
            res.send(lexicon);
        }

        public getCommonWords(req: express.Request, res: express.Response, next: express.NextFunction) {
            let commonWordsFilePath = '../server/lexicon/commonWords.json';
            let commonWords: string[]= [];
            let lexiconReader = new LexiconReader();

            commonWords = lexiconReader.readJson(commonWordsFilePath);
            res.send(commonWords);
        }

        public getUncommonWords(req: express.Request, res: express.Response, next: express.NextFunction) {
            let uncommonWordsFilePath = '../server/lexicon/uncommonWords.json';
            let uncommonWords: string[]= [];
            let lexiconReader = new LexiconReader();

            uncommonWords = lexiconReader.readJson(uncommonWordsFilePath);
            res.send(uncommonWords);
        }
        
        public getWordsOfLength(req: express.Request, res: express.Response, next: express.NextFunction) {
            let wordLength = req.params.wordLength;
            let commonWordsFilePath = '../server/lexicon/commonWords.json';
            let uncommonWordsFilePath = '../server/lexicon/uncommonWords.json';
            let commonWords: string[]= [];
            let uncommonWords: string[]= [];
            let wordsOfLength: string[] = [];
            let lexiconReader = new LexiconReader();
            
            commonWords = lexiconReader.readWordsOfLengthJson(commonWordsFilePath, wordLength);
            uncommonWords = lexiconReader.readWordsOfLengthJson(uncommonWordsFilePath, wordLength);
            wordsOfLength = uncommonWords.concat(uncommonWords);

            res.send(wordsOfLength);
        }

        public getWordsCharAt(req: express.Request, res: express.Response, next: express.NextFunction) {
            let char = req.params.char;
            let position = req.params.position;
            let lexiconReader = new LexiconReader();
            let lexicon: string[] = [];
            let wordsCharAt:string[] = [];
            let filepath: string = '../server/lexicon/englishWords.txt';
            
            lexicon = lexiconReader.readWords(filepath);
            wordsCharAt = lexiconReader.getWordsContainingLetter(lexicon, char, position);

            res.send(wordsCharAt);
            
        }


    }
}

export = Route;