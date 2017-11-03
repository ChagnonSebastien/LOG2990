import { Injectable } from '@angular/core';
import { Game } from '../../../../commun/crossword/game';
import { Player } from '../../../../commun/crossword/player';
import { SocketHandlerSerivce } from './crossword-socket-handler.service';

@Injectable()
export class GameManagerService {
    private game: Game;
    private readonly HOST_NAME = 'http://' + window.location.hostname;
    private readonly SERVER_PORT = ':3000';
    private socket: SocketIOClient.Socket;

    constructor(private socketHandlerSerivce: SocketHandlerSerivce) {
        this.socket = this.socketHandlerSerivce.requestSocket(this.HOST_NAME + this.SERVER_PORT);

        this.socket.on('gameCreated', data => {
            this.game = data;
            console.log(data);
        });

        this.socket.on('player 2 joined your game', data => {
            this.game = data;
        });

        this.socket.on('you joined another game', data => {
            this.game = data;
        });
    }

    public getGame(): Game {
        return this.game;
    }

    public createGame(type: string, difficulty: string, mode: string, player1: Player) {
        this.socket.emit('createGame', type, difficulty, mode, player1);
    }

    public joinGame(gameId: string, username: string) {
        this.socket.emit('joinGame', gameId, username);
    }

    public leaveGame(gameId: string, username: string) {
        this.socket.emit('leaveGame', gameId, username);
    }
}
