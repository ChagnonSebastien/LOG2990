import * as http from 'http';
import * as express from 'express';

import { SocketServer } from '../app/socket-server';

export const TEST_HOST = 'http://localhost';
export let TEST_PORT: number;

const app = express();
const server = http.createServer(app);
server.listen(0, () => {
    TEST_PORT = server.address().port;
    console.log('Testing on port ' + TEST_PORT);
});
SocketServer.setServer(server);
export const socketServer = SocketServer.getInstance();
