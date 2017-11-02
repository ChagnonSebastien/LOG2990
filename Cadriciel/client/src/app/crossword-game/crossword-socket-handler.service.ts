import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SocketHandlerSerivce {
    constructor() { }
    private activeSocket: SocketIOClient.Socket;

    public requestSocket(server: string): any {

            if (this.activeSocket === undefined) {
                this.activeSocket = io.connect(server);
            }
                return this.activeSocket;
            }

    public disconnectSocket(): void {
         this.activeSocket.disconnect();
         this.activeSocket = undefined;
     }

}
