import { Injectable } from '@angular/core';
import { Player } from '../../../../commun/crossword/player';
import { SocketHandlerSerivce } from './crossword-socket-handler.service';
import {GameManagerService} from './crossword-game-manager.service';

@Injectable()
export class GameManagerServicePlayer2 extends GameManagerService  {
    public socket: SocketIOClient.Socket;
    constructor(protected socketHandlerSerivce: SocketHandlerSerivce) {
        super(socketHandlerSerivce);
    }

    public getGames(): Promise<{ id: string, playerHost: string, difficulty: string, mode: string, username2: string }[]> {
        this.socket.emit('getGames');
        const gamesPromise = new Promise<{
            id: string, playerHost: string, difficulty: string,
            mode: string, username2: string
        }[]>(
            (res, rej) => this.socket.on('sent all games', data => res(data)));
        return gamesPromise;
    }

    public joinGame(gameId: string, player: Player) {
        this.socket.emit('joinGame', gameId, player);
    }


}
