import * as express from 'express';

import * as bodyParser from 'body-parser';

import * as db from 'mongojs';

module Route {

    export class Login {

        public authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
            let postBody = req.body.name;
            res.send(postBody);
        }
    }
}

export = Route;