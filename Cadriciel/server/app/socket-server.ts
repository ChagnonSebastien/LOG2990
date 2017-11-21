import * as io from 'socket.io';
import * as http from 'http';

export class SocketServer {
    private static socketServerInstance: SocketIO.Server;

    private constructor() { }

    public static getInstance(server: http.Server): SocketIO.Server {
        if (this.socketServerInstance === undefined) {
            this.socketServerInstance = io.listen(server);
        }
        return this.socketServerInstance;
    }
}
