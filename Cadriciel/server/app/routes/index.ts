import * as express from 'express';
import { Message } from '../../../commun/communication/message';
import { LexiconList } from '../../../commun/communication/lexicon-list';
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
            let lexicon: string[] = [];
            lexicon = fileReader.readfile(fileReader.filepath);
            const listOfWords = new LexiconList()
            listOfWords.listOfWords = lexicon;
            
            res.send(JSON.stringify(listOfWords));
            console.log(JSON.stringify(listOfWords));
        }
    }
}

export = Route;
