import { Injectable } from '@angular/core';
import { Player } from '../../../../commun/crossword/player';
import { SocketHandlerSerivce } from './crossword-socket-handler.service';
import {GameManagerService} from './crossword-game-manager.service';

@Injectable()
export class GameManagerServicePlayer1 extends GameManagerService  {
    public socket: SocketIOClient.Socket;
    constructor(protected socketHandlerSerivce: SocketHandlerSerivce) {
        super(socketHandlerSerivce);

    }

    public createGame(type: string, difficulty: string, mode: string, player1: Player) {
        this.socket.emit('createGame', type, difficulty, mode, player1);
    }

}
