import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import { GameConfiguration } from '../game-configuration';

@Injectable()
export class CrosswordSocketService {
    public socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io.connect(GameConfiguration.SERVER);
    }
}
