import * as express from 'express';
import { ServerCrosswords } from '../crosswordGrid/serverCrosswords';

module Route {

    export class ServerCrosswordsRoute {
        public serverCrosswords: ServerCrosswords;

        constructor(collection: string) {
            this.serverCrosswords = ServerCrosswords.getInstance();
        }

        public getCrossword(req: express.Request, res: express.Response, next: express.NextFunction) {
            this.serverCrosswords = ServerCrosswords.getInstance();
            this.serverCrosswords.setCollection(req.params.collection);
            const level = req.params.level;

            this.serverCrosswords.getCrossword(level).then((crossword) => {
                res.send(JSON.stringify(crossword));
            });
        }

    }
}

export = Route;
