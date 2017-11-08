import { Injectable } from '@angular/core';
import { Player } from '../../../../commun/crossword/player';
import { ClientGameInfo } from '../../../../commun/crossword/clientGameInfo';
import { SocketHandlerSerivce } from './crossword-socket-handler.service';
import { GameManagerService } from './crossword-game-manager.service';

@Injectable()
export class GameManagerServicePlayer2 extends GameManagerService {
    public socket: SocketIOClient.Socket;
    constructor(protected socketHandlerSerivce: SocketHandlerSerivce) {
        super(socketHandlerSerivce);
    }

    public getGames(): Promise<ClientGameInfo[]> {
        this.socket.emit('getGames');
        const gamesPromise = new Promise<ClientGameInfo[]>(
            (res, rej) => this.socket.on('sent all games', data => res(data)));
        return gamesPromise;
    }

    public joinGame(gameId: string, player: Player) {
        this.socket.emit('joinGame', gameId, player);
    }


}
