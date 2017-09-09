import * as express from 'express';

module Route {

    export class Login {

        public authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
            let postBody = req.body.name;
            res.send(postBody);
        }
    }
}

export = Route;