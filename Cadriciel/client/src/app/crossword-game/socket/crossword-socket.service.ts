import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

const SERVER = 'http://localhost:3000';
@Injectable()
export class CrosswordSocketService {
    public socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io.connect(SERVER);
    }
}
