import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Game } from '../../../../commun/crossword/game';
import { Player } from '../../../../commun/crossword/player';
import { SocketHandlerSerivce } from './crossword-socket-handler.service';
import { ClientGameInfo } from '../../../../commun/crossword/clientGameInfo';

@Injectable()
export class CrosswordMultiplayerService {
    public socket: SocketIOClient.Socket;
    protected game: Game;
    protected readonly HOST_NAME = 'http://' + window.location.hostname;
    protected readonly SERVER_PORT = ':3000';
    protected playerTwoSubject: Subject<any>;
    protected endGameSubject: Subject<any>;

    constructor(protected socketHandlerSerivce: SocketHandlerSerivce) {
        this.playerTwoSubject = new Subject();
        this.endGameSubject = new Subject();
        this.game = new Game();
        this.socketHandlerSerivce.requestSocket(this.HOST_NAME + this.SERVER_PORT).then(socket => {
            this.socket = socket;

            this.socket.on('player 2 joined', data => {
                this.game = data;
                this.playerTwoSubject.next('player 2 joined');
            });

            this.socket.on('game created', data => {
                this.game.id = data;
            });

            this.socket.on('opponent left', data => {
                alert('Your opponent left the game');
                this.leaveGame();
            });
        });
    }

    public playerTwoAlerts(): Observable<any> {
        return this.playerTwoSubject.asObservable();
    }

    public leaveGameAlerts(): Observable<any> {
        return this.endGameSubject.asObservable();
    }

    public getGame(): Game {
        return this.game;
    }

    public createGame(type: string, difficulty: string, mode: string, player1: Player) {
        this.socket.emit('createGame', type, difficulty, mode, player1);
    }
    public leaveGame() {
        this.socket.emit('leaveGame', this.game.id);
        this.endGameSubject.next('leave game');
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

    public connectionStatus() {
        return this.socket !== undefined;
    }
}
