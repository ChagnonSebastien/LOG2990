import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';


const URI = `http://${window.location.hostname}`;
const PORT = '3000';

@Injectable()
export class CrosswordSocketService {
    public socket: SocketIOClient.Socket;

    constructor() {
        this.socket = io.connect(`${URI}:${PORT}`);
    }

    /*
    public requestSocket(server: string): Promise<SocketIOClient.Socket> {

        if (this.socket === undefined) {
            this.socket = io.connect(server);
        }
        return Promise.resolve(this.socket);
    }

    public disconnectSocket(): void {
        if (this.socket !== undefined) {
            this.socket.disconnect();
            this.socket = undefined;
        }
    }

    public connected(): boolean {
        return this.socket !== undefined;
    }*/

}
