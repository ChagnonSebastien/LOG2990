import { SocketServer } from '../socket-server';

export class MultiplayerManager {
    private static multiplayerManager: MultiplayerManager;

    private constructor() { }

    public static getInstance() {
        if (this.multiplayerManager === undefined) {
            this.multiplayerManager = new MultiplayerManager();
        }
        return this.multiplayerManager;
    }
}
