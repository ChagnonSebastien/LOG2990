import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Game } from '../../../../commun/crossword/game';
import { Player } from '../../../../commun/crossword/player';
import { SocketHandlerSerivce } from './crossword-socket-handler.service';

@Injectable()
export class GameManagerService {
    private game: Game;
    private readonly HOST_NAME = 'http://' + window.location.hostname;
    private readonly SERVER_PORT = ':3000';
    private socket: SocketIOClient.Socket;
    private playerTwoSubject: Subject<any>;

    constructor(private socketHandlerSerivce: SocketHandlerSerivce) {
        this.playerTwoSubject = new Subject();
        this.socketHandlerSerivce.requestSocket(this.HOST_NAME + this.SERVER_PORT).then(socket => {
            this.socket = socket;

            this.socket.on('player 2 joined', data => {
                this.game = data;
                this.playerTwoSubject.next('player 2 joined');
            });
        });
    }

    public playerTwoAlerts(): Observable<any> {
        return this.playerTwoSubject.asObservable();
    }

    public getGame(): Game {
        return this.game;
    }

    public getGames(): Promise<Game[]> {
        this.socket.emit('getGames');
        const gamesPromise = new Promise<Game[]>(
            (res, rej) => this.socket.on('sent all games', data => res(data)));
        return gamesPromise;
    }

    public createGame(type: string, difficulty: string, mode: string, player1: Player) {
        this.socket.emit('createGame', type, difficulty, mode, player1);
    }

    public joinGame(gameId: string, player: Player) {
        this.socket.emit('joinGame', gameId, player);
    }

    public leaveGame(gameId: string, username: string) {
        this.socket.emit('leaveGame', gameId, username);
    }
}
