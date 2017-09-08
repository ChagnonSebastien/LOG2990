import * as express from 'express';
import { Message } from '../../../commun/communication/message';

module Route {

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
            res.send(JSON.stringify(message));
        }
    }
}

export = Route;
