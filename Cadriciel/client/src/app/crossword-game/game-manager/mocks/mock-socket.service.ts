import { CrosswordSocketService } from '../../socket/crossword-socket.service';
import * as io from 'socket.io-client';

export class MockSocketService implements CrosswordSocketService {
    public socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io.connect('0.0.0.0');
        this.socket.close();
    }
}
