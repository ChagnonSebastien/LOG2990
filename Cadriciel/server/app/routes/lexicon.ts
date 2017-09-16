import * as express from 'express';
import * as request from 'request';
import { LexiconReader } from '../lexicon-reader';

module Route {

    export class Lexicon {
        public lexiconFilePath: string = '../server/lexicon/englishWords.txt';

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
            lexicon = lexiconReader.readWords(this.lexiconFilePath);
            res.send(lexicon);
        }

        public getWordsOfLength(req: express.Request, res: express.Response, next: express.NextFunction) {
            let wordLength = req.params.wordLength;
            let lexiconReader = new LexiconReader();
            let wordsOfLength:string[] = lexiconReader.readWordsOfLength(this.lexiconFilePath, wordLength);
            res.send(wordsOfLength);
        }

        public getWordsWithCharAt(req: express.Request, res: express.Response, next: express.NextFunction) {
            let charWanted = req.params.char;
            let position = Number(req.params.position);
            let lexiconReader = new LexiconReader();
            let wordsWithChar = lexiconReader.getWordsWithChar(this.lexiconFilePath, charWanted, position);
            res.send(wordsWithChar);
        }

    }
}

export = Route;