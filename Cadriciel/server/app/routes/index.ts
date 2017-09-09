import * as express from 'express';
import { Message } from '../../../commun/communication/message';
import { LexiconApi } from './lexicon-api';
import { Request } from 'express';
import { FileReader } from '../file-reader';

module Route {
    let lexicon = new LexiconApi;
    export class Index {

        public index(req: express.Request, res: express.Response, next: express.NextFunction) {
            const message = new Message();
            message.title = 'Hello';
            message.body = 'World';
            res.send(JSON.stringify(message));
        }

        public wordDefinition(req: express.Request, res: express.Response, next: express.NextFunction) {
            const message = new Message();
            
            let word = req.params.word;
            message.title = 'Hello';
            message.body = word;
            res.send(JSON.stringify({"title":"hello"}));

        }

        public englishWordLexicon(red: express.Request, res: express.Response, next: express.NextFunction) {
            let fileReader = new FileReader();
            let lexicon: string[] = fileReader.readfile(fileReader.filepath);
            //let wordList = lexicon.split("\n")
            //res.sendFile('../../server/englishWords.txt');

            //res.send("Hello");
            //res.send(JSON.stringify({"title":"hello"}));
            //console.log(lexicon.split('\n'));

            res.send(JSON.stringify({"title": "see console for lexicon"}));
        }
    }
}

export = Route;
