import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SocketHandlerSerivce {
    constructor() { }
    private activeSocket: SocketIOClient.Socket;

    public requestSocket(server: string): Promise<SocketIOClient.Socket> {

            if (this.activeSocket === undefined) {
                this.activeSocket = io.connect(server);
            }
                return Promise.resolve(this.activeSocket);
            }

    public disconnectSocket(): void {
         this.activeSocket.disconnect();
         this.activeSocket = undefined;
     }

}
